# 🪐 exoSimulator
 
> Sobreviva em um planeta alienígena configurado por você. Um jogo educativo de gerenciamento de recursos baseado em dados reais de exoplanetas.
 
---
 
## 📖 Sobre o Projeto
 
**exoSimulator** é um aplicativo mobile desenvolvido em React Native com Expo, criado como projeto de estudo com foco em **dados espaciais e gamificação educativa**. O jogador configura as condições físicas de um planeta — temperatura, gravidade e pressão atmosférica — e precisa sobreviver o maior tempo possível gerenciando recursos vitais de uma colônia espacial.
 
O diferencial educativo está na forma como os dados do planeta afetam diretamente a dificuldade do jogo: quanto mais extremas as condições inseridas (comparadas a planetas habitáveis reais), maior o desafio para manter a colônia viva. O **acelerômetro do dispositivo** é integrado diretamente à mecânica central do jogo — inclinando o celular, o jogador simula fisicamente a atividade sísmica do planeta, que afeta em tempo real o consumo de todos os recursos da colônia.
 
---
 
## 🎯 Objetivo
 
- Ensinar conceitos de **astrofísica e ciências planetárias** de forma interativa
- Demonstrar como variáveis como gravidade, temperatura e pressão atmosférica afetam a habitabilidade de planetas
- Utilizar o **acelerômetro** do dispositivo como mecânica principal de gameplay, conectando o mundo físico à simulação espacial
- Praticar desenvolvimento mobile com React Native, Firebase e TypeScript
---
 
## 📱 Recurso Mobile: Acelerômetro
 
O acelerômetro é o recurso nativo central do exoSimulator, integrado por meio da biblioteca `expo-sensors`. Ele transforma a inclinação física do celular numa variável de jogo com impacto direto e contínuo na sobrevivência da colônia.
 
### Como funciona tecnicamente
 
O sensor fornece leituras do eixo X (inclinação lateral) a cada 150ms. Esses valores são processados em três etapas:
 
**1. Leitura e normalização**
```
rawTilt = min(|x| × sensibilidade, 1)
```
O valor absoluto do eixo X é multiplicado por um fator de sensibilidade e limitado ao intervalo [0, 1], onde 0 é o celular na horizontal e 1 é a inclinação máxima.
 
**2. Suavização**
```
smoothed = smoothed × 0.8 + rawTilt × 0.2
```
Um filtro de média móvel ponderada evita que o nível sísmico fique oscilando abruptamente pelo tremor natural das mãos, tornando a barra de atividade sísmica estável e legível.
 
**3. Escala pela gravidade do planeta**
```
sensibilidade = max(0.5, gravidade / 5)
```
A sensibilidade do sensor é proporcional à gravidade configurada no planeta. Isso significa que num planeta de alta gravidade (ex: 8g), qualquer inclinação pequena já dispara alta atividade sísmica — refletindo a realidade de que corpos com maior massa tendem a ter maior instabilidade tectônica. Num planeta de gravidade baixa (ex: 0.3g), o jogador precisa inclinar muito mais para sentir o efeito.
 
### Impacto no gameplay
 
O nível sísmico atual (`sismicLevel`, de 0 a 1) atua como multiplicador sobre dois sistemas simultâneos:
 
**Decaimento dos recursos (a cada segundo):**
```
decaimento_real = decaimento_base × multiplicador_dificuldade × (1 + sismicLevel)
```
Com atividade sísmica máxima, os recursos decaem o dobro da velocidade normal.
 
**Custo das estruturas (ao ativar):**
```
custo_real = custo_base × (1 + sismicLevel × 0.5)
```
Os custos negativos de cada estrutura aumentam em até 50% com atividade sísmica alta. Os ganhos permanecem inalterados — a estrutura produz o mesmo, mas consome mais para operar sob tremores.
 
### Gestão de permissões e ciclo de vida
 
O hook `useAccelerometer` solicita a permissão do sensor antes de iniciar (`requestPermissionsAsync`), e trata três situações:
 
- **Permissão negada** — exibe aviso ao jogador e desativa a mecânica sísmica sem quebrar o jogo
- **App em segundo plano** — o `AppState` do React Native detecta a mudança e pausa o sensor junto com o loop de jogo, retomando ao voltar ao app
- **Sensor indisponível** — capturado por `try/catch`, silencia o erro e mantém o nível sísmico em zero
- **Web** — detectado por `Platform.OS`, o sensor é desativado automaticamente pois não existe no navegador
### Feedback visual
 
A barra de atividade sísmica (`SismicBar`) exibe o nível em tempo real com animação fluida (`Animated.timing`) e muda de cor conforme o perigo:
 
| Nível | Cor | Status |
|---|---|---|
| 0 – 0.3 | 🟢 Verde | Estável |
| 0.3 – 0.6 | 🟡 Amarelo | Moderada |
| 0.6 – 0.8 | 🟠 Laranja | Alta |
| 0.8 – 1.0 | 🔴 Vermelho | Crítica |
 
A barra também exibe um texto contextual baseado na gravidade do planeta (ex: "Gravidade extrema (8g) — planeta altamente instável"), conectando a mecânica à educação sobre física planetária.
 
---
 
## 🚀 Funcionalidades
 
### Autenticação
- Cadastro com nome, email e senha
- Login com email e senha
- Recuperação de senha por email
- Validação de campos com mensagens de erro inline por campo
- Tradução dos erros do Firebase para português
### Configuração do Planeta
- Formulário com 3 parâmetros científicos configuráveis:
  - 🌡️ **Temperatura** (-257°C a 550°C)
  - ⬇️ **Gravidade** (0.1g a 10g)
  - 💨 **Pressão Atmosférica** (0% a 100%)
- Validação de limites com feedback contextual
- Cada parâmetro é comparado a uma escala de referência baseada em exoplanetas reais
### Gameplay
- 3 recursos vitais que decaem continuamente a cada segundo:
  - 🫁 **Oxigênio** — afetado pela pressão atmosférica e gravidade
  - 🍽️ **Comida** — afetada pela temperatura e gravidade
  - ⚡ **Energia** — afetada pela temperatura e gravidade
- 3 estruturas interativas para recuperar recursos:
  - 🍳 **Cozinha** — aumenta Comida, consome Energia e Oxigênio
  - ⚡ **Gerador** — aumenta Energia, consome Oxigênio
  - 🌿 **Fazenda de O₂** — aumenta Oxigênio, consome Energia e Comida
- **Atividade sísmica** controlada pelo acelerômetro do dispositivo
- Painel de efeitos mostrando o impacto real de cada ação, incluindo o custo adicional da sísmica
- Card educativo exibido ao iniciar, explicando as condições do planeta criado
- Jogo sem condição de vitória — sobreviva o máximo possível
### Game Over
- Resumo completo da partida ao final
- Explicação educativa sobre como a gravidade do planeta afetou o jogo
- Comparação entre os multiplicadores de dificuldade e os parâmetros inseridos
- Salvamento automático da partida no Firebase
### Histórico
- Todas as partidas são salvas por usuário no Firebase Realtime Database
- Listagem na tela inicial com tempo de sobrevivência, parâmetros do planeta, dificuldade média e data
- Pull-to-refresh para atualizar o histórico
---
 
## 🧠 Sistema de Dificuldade
 
A dificuldade é calculada automaticamente com base nos parâmetros inseridos. Cada valor é **normalizado dentro de um range de referência** e comparado ao centro da escala (considerado "habitável"):
 
```
Normalizado  = (valor - min) / (max - min)
Extremidade  = |normalizado - 0.5| × 2     // 0 = ideal, 1 = extremo
Multiplicador = 0.5 + extremidade × 2      // 0.5x (fácil) a 2.5x (extremo)
```
 
### Como cada parâmetro afeta os recursos
 
| Parâmetro | Recurso mais afetado | Efeito secundário |
|---|---|---|
| Temperatura extrema | Comida (60%) | Energia (50%) |
| Gravidade alta | Energia (50%) | Comida (40%) |
| Pressão baixa | Oxigênio (70%) | — |
 
---
 
## 🛠️ Tecnologias Utilizadas
 
| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | 54.0.35 | Ambiente de desenvolvimento |
| TypeScript | 5.9.3 | Tipagem estática |
| Firebase Auth | 12.14.0 | Autenticação de usuários |
| Firebase Realtime Database | 12.14.0 | Persistência do histórico |
| expo-sensors | 15.0.8 | Acelerômetro — mecânica de atividade sísmica |
| react-native-svg | 15.12.1 | Gráficos circulares de recursos |
| React Navigation | 7.x | Navegação entre telas |
 
---
 
## 📁 Estrutura do Projeto
 
```
src/
├── components/
│   ├── HistoricoCard.tsx      # Card de partida no histórico
│   ├── ResourceCircle.tsx     # Indicador circular de recurso (SVG)
│   ├── ResourceHeader.tsx     # Barra superior com os 3 recursos
│   └── SismicBar.tsx          # Barra de atividade sísmica animada
│
├── firebase/
│   ├── authService.js         # Login, cadastro, recuperação de senha
│   ├── config.js              # Inicialização do Firebase
│   └── historicoService.js    # Salvar e buscar histórico de partidas
│
├── game/
│   ├── data/
│   │   └── structure.ts       # Configuração das estruturas e seus efeitos
│   ├── engine/
│   │   ├── difficultySystem.ts  # Cálculo dos multiplicadores de dificuldade
│   │   ├── gameReducer.ts       # Reducer central do estado do jogo
│   │   └── resourceSystem.ts    # Lógica de decaimento e efeitos nos recursos
│   ├── hooks/
│   │   ├── useAccelerometer.ts  # Leitura do sensor e cálculo do nível sísmico
│   │   └── useGame.ts           # Hook principal do loop de jogo
│   └── types/
│       └── gameTypes.ts         # Tipos TypeScript do domínio do jogo
│
├── navigation/
│   └── AppNavigator.js        # Configuração das rotas
│
└── screens/
    ├── ForgotPasswordScreen.js
    ├── GameOverScreen.tsx
    ├── GameScreen.tsx
    ├── HomeScreen.tsx
    ├── LoginScreen.js
    └── RegisterScreen.js
```
 
---
 
## ▶️ Como Executar
 
### Pré-requisitos
 
- Node.js v22+
- npm
- Expo Go instalado no celular (SDK 54)
- Conta no Firebase com projeto configurado
### Instalação
 
```bash
# Clonar o repositório
git clone https://github.com/glitchy-luiz/gs-mobile.git
cd gs-mobile
 
# Instalar dependências
npm install
 
# Iniciar o servidor de desenvolvimento
npx expo start
```
 
### Configuração do Firebase
 
1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Crie um projeto ou use um existente
3. Ative **Authentication → Email/senha**
4. Ative o **Realtime Database** e configure as regras:
```json
{
  "rules": {
    "historico": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".indexOn": ["timestamp"]
      }
    }
  }
}
```
 
5. Copie as credenciais do projeto para `src/firebase/config.js`
### Executando no dispositivo
 
Após rodar `npx expo start`, escaneie o QR code com o app **Expo Go** no celular.
 
> ⚠️ O acelerômetro funciona apenas em dispositivos físicos. No navegador (web), a mecânica sísmica é desativada automaticamente.
 
---
 
## 🎮 Como Jogar
 
1. **Crie uma conta** ou faça login
2. **Configure seu planeta** — insira temperatura, gravidade e pressão atmosférica
3. **Inicie a missão** — um card explicará as condições do planeta com base nos dados inseridos
4. **Gerencie seus recursos** — toque nas estruturas para recuperar Oxigênio, Comida ou Energia
5. **Controle a atividade sísmica** — incline o celular para simular tremores; quanto mais inclinado, mais rápido seus recursos caem
6. **Sobreviva o máximo possível** — o jogo termina quando qualquer recurso chegar a zero
7. **Veja o resumo** — ao final, você verá quanto tempo sobreviveu e como o planeta afetou a partida
### Dicas
 
- Mantenha o celular o mais reto possível — a atividade sísmica é o maior risco contínuo
- Planetas com gravidade entre 0.5g e 2g são mais fáceis de gerenciar
- Priorize Oxigênio — ele decai mais rápido em planetas com atmosfera fina
- Em temperaturas extremas, a Comida acaba rapidamente — use a Cozinha com frequência
---
 
## 📚 Conceitos Científicos Abordados
 
| Conceito | Como aparece no jogo |
|---|---|
| Gravidade planetária | Afeta consumo de energia e comida; define a sensibilidade sísmica do acelerômetro |
| Pressão atmosférica | Principal fator no decaimento de oxigênio |
| Temperatura superficial | Impacta a degradação de alimentos e o gasto energético |
| Atividade tectônica | Simulada fisicamente pelo acelerômetro; planetas de alta gravidade são mais instáveis |
| Habitabilidade planetária | Parâmetros próximos ao centro da escala tornam o planeta mais habitável |
 
Os ranges de referência utilizados (-257°C a 550°C para temperatura, 0.1g a 10g para gravidade) foram definidos com base em dados de exoplanetas catalogados, onde valores extremos representam condições observadas em planetas reais fora do sistema solar.
 
---
 
## 👨‍💻 Autores
Bruno Otávio
Guilherme Flores
Leonardo
Luiz Souza
Marcello Freitas
 
