import { Structure } from "../types/gameTypes"

export const structures: Record<string, Structure> = {
  cozinha: {
    name: "Cozinha",
    efeito: { comida: 20, energia: -5, oxigenio: -10 }
  },
  gerador: {
    name: "Gerador",
    efeito: { energia: 25, oxigenio: -5 }
  },
  fazenda: {
    name: "Fazenda",
    efeito: { comida: 15, energia: -10, oxigenio: -5 }
  }
}