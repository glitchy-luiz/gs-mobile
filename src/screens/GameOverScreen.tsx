import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { GameSummary } from "../game/types/gameTypes"

type Props = {
  route: { params: GameSummary }
  navigation: any
}

export default function GameOverScreen({ navigation, route }: Props) {
  const { time, planetData, multipliers } = route.params

  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Home")}>
        <Text style={styles.buttonText}>Tentar novamente 🚀</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f", padding: 24, justifyContent: "center" },
  title:     { fontSize: 32, color: "#fff", fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle:  { fontSize: 18, color: "#888", textAlign: "center", marginBottom: 32 },
  card: {
    backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: "#333",
  },
  cardTitle: { color: "#aaa", fontSize: 12, fontWeight: "600", marginBottom: 8 },
  cardText:  { color: "#ddd", fontSize: 14, marginBottom: 4 },
  button: {
    backgroundColor: "#4a90e2", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
})