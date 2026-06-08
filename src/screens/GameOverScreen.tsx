import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native"
import { getAuth } from "firebase/auth"
import { salvarPartida } from "../firebase/historicoService"
import { GameSummary } from "../game/types/gameTypes"

type Props = {
  route: { params: GameSummary }
  navigation: any
}

export default function GameOverScreen({ navigation, route }: Props) {
  const { time, planetData, multipliers } = route.params
  const [saving, setSaving] = useState(true)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    async function salvar() {
      try {
        const user = getAuth().currentUser
        if (!user) throw new Error("Usuário não autenticado")
        await salvarPartida(user.uid, { time, planetData, multipliers })
      } catch (e) {
        setSaveError(true)
      } finally {
        setSaving(false)
      }
    }
    salvar()
  }, [])

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0a0a0f" }}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>💀 Missão Encerrada</Text>
      <Text style={styles.subtitle}>Você sobreviveu {time} segundos</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Condições do planeta</Text>
        <Text style={styles.cardText}>🌡️ Temperatura: {planetData.temperatura}°C</Text>
        <Text style={styles.cardText}>⬇️ Gravidade: {planetData.gravidade}g</Text>
        <Text style={styles.cardText}>💨 Pressão: {planetData.pressaoAtmosferica}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Impacto no jogo</Text>
        <Text style={styles.cardText}>Comida decaiu {multipliers.comida.toFixed(1)}x mais rápido</Text>
        <Text style={styles.cardText}>Oxigênio decaiu {multipliers.oxigenio.toFixed(1)}x mais rápido</Text>
        <Text style={styles.cardText}>Energia decaiu {multipliers.energia.toFixed(1)}x mais rápido</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌍 Sobre a gravidade do seu planeta</Text>
        <Text style={styles.cardText}>
          Com {planetData.gravidade}g,
          {planetData.gravidade > 3
            ? ` seu planeta tem ${((planetData.gravidade - 1) * 100).toFixed(0)}% mais força gravitacional que a Terra, tornando a crosta instável e os tremores muito mais frequentes.`
            : planetData.gravidade < 1
            ? ` seu planeta tem gravidade menor que a Terra, resultando em menor pressão na crosta e atividade sísmica reduzida.`
            : ` a gravidade é próxima da terrestre — a atividade sísmica se comporta de forma familiar.`}
        </Text>
        <Text style={[styles.cardText, { marginTop: 6, color: "#555" }]}>
          Na realidade, planetas com alta gravidade tendem a ter núcleos maiores
          e mais ativos, gerando mais calor interno e atividade tectônica.
        </Text>
      </View>

      {saving && (
        <View style={styles.saveStatus}>
          <ActivityIndicator size="small" color="#4a90e2" />
          <Text style={styles.saveText}>Salvando partida...</Text>
        </View>
      )}
      {!saving && saveError && (
        <Text style={styles.saveError}>⚠️ Não foi possível salvar esta partida</Text>
      )}
      {!saving && !saveError && (
        <Text style={styles.saveSuccess}>✓ Partida salva no histórico</Text>
      )}

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={() => navigation.replace("Home")}
        disabled={saving}
      >
        <Text style={styles.buttonText}>Voltar ao início 🚀</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:      { padding: 24, paddingBottom: 48 },
  title:          { fontSize: 32, color: "#fff", fontWeight: "bold", textAlign: "center", marginBottom: 8, marginTop: 40 },
  subtitle:       { fontSize: 18, color: "#888", textAlign: "center", marginBottom: 32 },
  card:           { backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#333" },
  cardTitle:      { color: "#aaa", fontSize: 12, fontWeight: "600", marginBottom: 8 },
  cardText:       { color: "#ddd", fontSize: 14, marginBottom: 4, lineHeight: 20 },
  saveStatus:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 },
  saveText:       { color: "#888", fontSize: 13 },
  saveError:      { color: "#e57373", textAlign: "center", marginBottom: 12, fontSize: 13 },
  saveSuccess:    { color: "#81C784", textAlign: "center", marginBottom: 12, fontSize: 13 },
  button:         { backgroundColor: "#4a90e2", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText:     { color: "#fff", fontSize: 16, fontWeight: "bold" },
})