import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useGame } from "../game/hooks/useGame"
import ResourceHeader from "../components/ResourceHeader"
import { PlanetData, StructureKey } from "../game/types/gameTypes"
import { structures } from "../game/data/structure"

export default function GameScreen({ navigation, route }: any) {
  const planetData: PlanetData = route.params?.planetData ?? {
    temperatura: 20,
    gravidade: 1,
    pressaoAtmosferica: 50,
  }

  const { state, dispatch, multipliers } = useGame(planetData)

  const [selectedStructure, setSelectedStructure] = useState<StructureKey | null>(null)

  // Navega para GameOver quando o jogo termina
  useEffect(() => {
    if (state.gameOver) {
      navigation.replace("GameOver", {
        time: state.time,
        planetData,
        multipliers,
      })
    }
  }, [state.gameOver])

  return (
    <View style={styles.container}>
      <ResourceHeader resources={state.resources} />

      {/* Painel educativo: mostra o impacto do planeta */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Condições do planeta</Text>
        <Text style={styles.infoText}>
          🌡️ Comida decai {multipliers.comida.toFixed(1)}x mais rápido
        </Text>
        <Text style={styles.infoText}>
          💨 Oxigênio decai {multipliers.oxigenio.toFixed(1)}x mais rápido
        </Text>
        <Text style={styles.infoText}>
          ⚡ Energia decai {multipliers.energia.toFixed(1)}x mais rápido
        </Text>
      </View>

      {/* Estruturas — placeholder até ter a cidade visual */}
      <View style={styles.structuresRow}>
        <TouchableOpacity
          style={styles.structureBtn}
            onPress={() => {
              setSelectedStructure("cozinha")
              dispatch({ type: "APPLY_STRUCTURE", payload: "cozinha" })
            }}

        >
          <Text style={styles.structureEmoji}>🍳</Text>
          <Text style={styles.structureLabel}>Cozinha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.structureBtn}
            onPress={() => {
              setSelectedStructure("gerador")
              dispatch({ type: "APPLY_STRUCTURE", payload: "gerador" })
            }}

        >
          <Text style={styles.structureEmoji}>⚡</Text>
          <Text style={styles.structureLabel}>Gerador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.structureBtn}
            onPress={() => {
              setSelectedStructure("fazenda")
              dispatch({ type: "APPLY_STRUCTURE", payload: "fazenda" })
            }}

        >
          <Text style={styles.structureEmoji}>🌿</Text>
          <Text style={styles.structureLabel}>Fazenda de O₂</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.timer}>⏱️ {state.time}s</Text>
      <EfeitosPanel structureKey={selectedStructure} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f" },
  infoPanel: {
    margin: 16,
    padding: 14,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  infoTitle: { color: "#aaa", fontSize: 12, marginBottom: 6, fontWeight: "600" },
  infoText:  { color: "#ddd", fontSize: 13, marginBottom: 2 },
  structuresRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingHorizontal: 16,
  },
  structureBtn: {
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    width: 100,
    borderWidth: 1,
    borderColor: "#333",
  },
  structureEmoji: { fontSize: 32 },
  structureLabel: { color: "#ddd", fontSize: 12, marginTop: 6, textAlign: "center" },
  timer: { color: "#555", textAlign: "center", marginTop: 24, fontSize: 14 },
})

function EfeitosPanel({ structureKey }: { structureKey: StructureKey | null }) {
  if (!structureKey) {
    return (
      <View style={efeitosStyles.container}>
        <Text style={efeitosStyles.hint}>
          Toque em uma estrutura para ver seus efeitos
        </Text>
      </View>
    )
  }

  const structure = structures[structureKey]
  const efeitos = structure.efeito

  const labels: Record<string, string> = {
    oxigenio: "Oxigênio",
    comida:   "Comida",
    energia:  "Energia",
  }

  return (
    <View style={efeitosStyles.container}>
      <Text style={efeitosStyles.title}>{structure.name}</Text>
      <View style={efeitosStyles.row}>
        {Object.entries(efeitos).map(([key, value]) => (
          <View key={key} style={efeitosStyles.item}>
            <Text style={[efeitosStyles.value, { color: value > 0 ? "#81C784" : "#e57373" }]}>
              {value > 0 ? `+${value}` : value}
            </Text>
            <Text style={efeitosStyles.label}>{labels[key] ?? key}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const efeitosStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    minHeight: 70,
    justifyContent: "center",
  },
  title:  { color: "#aaa", fontSize: 12, fontWeight: "600", marginBottom: 8 },
  hint:   { color: "#444", fontSize: 13, textAlign: "center" },
  row:    { flexDirection: "row", gap: 24 },
  item:   { alignItems: "center" },
  value:  { fontSize: 18, fontWeight: "bold" },
  label:  { color: "#888", fontSize: 11, marginTop: 2 },
})