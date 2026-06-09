import { View, Text, StyleSheet } from "react-native"

type Partida = {
  id: string
  time: number
  timestamp: number
  planetData: { temperatura: number; gravidade: number; pressaoAtmosferica: number }
  multipliers: { oxigenio: number; comida: number; energia: number }
}

type Props = { partida: Partida }

function formatarData(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  })
}

function formatarTempo(segundos: number): string {
  if (segundos < 60) return `${segundos}s`
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}m ${s}s`
}

export default function HistoricoCard({ partida }: Props) {
  const { time, timestamp, planetData, multipliers } = partida

  const diffMedia = ((multipliers.oxigenio + multipliers.comida + multipliers.energia) / 3).toFixed(1)

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.tempo}>⏱️ {formatarTempo(time)}</Text>
        <Text style={styles.data}>{formatarData(timestamp)}</Text>
      </View>

      {/* Dados do planeta */}
      <View style={styles.row}>
        <Text style={styles.tag}>🌡️ {planetData.temperatura}°C</Text>
        <Text style={styles.tag}>⬇️ {planetData.gravidade}g</Text>
        <Text style={styles.tag}>💨 {planetData.pressaoAtmosferica}%</Text>
      </View>

      {/* Dificuldade */}
      <View style={styles.diffRow}>
        <Text style={styles.diffLabel}>Dificuldade média</Text>
        <Text style={[styles.diffValue, { color: diffColor(parseFloat(diffMedia)) }]}>
          {diffMedia}x
        </Text>
      </View>
    </View>
  )
}

function diffColor(value: number): string {
  if (value < 1.2) return "#81C784"
  if (value < 1.8) return "#FFD54F"
  return "#e57373"
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tempo:     { color: "#fff", fontSize: 16, fontWeight: "bold" },
  data:      { color: "#555", fontSize: 12 },
  row:       { flexDirection: "row", gap: 8, marginBottom: 10 },
  tag: {
    backgroundColor: "#0a0a0f",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: "#aaa",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  diffRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  diffLabel: { color: "#555", fontSize: 12 },
  diffValue: { fontSize: 14, fontWeight: "bold" },
})