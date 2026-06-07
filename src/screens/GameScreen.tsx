import { useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useGame } from "../game/hooks/useGame"
import ResourceHeader from "../components/ResourceHeader"
import { PlanetData } from "../game/types/gameTypes"

export default function GameScreen({ navigation, route }: any) {
  const planetData: PlanetData = route.params?.planetData ?? {
    temperatura: 20,
    gravidade: 1,
    pressaoAtmosferica: 50,
  }

  const { state, dispatch, multipliers } = useGame(planetData)

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
          onPress={() => dispatch({ type: "APPLY_STRUCTURE", payload: "cozinha" })}
        >
          <Text style={styles.structureEmoji}>🍳</Text>
          <Text style={styles.structureLabel}>Cozinha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.structureBtn}
          onPress={() => dispatch({ type: "APPLY_STRUCTURE", payload: "gerador" })}
        >
          <Text style={styles.structureEmoji}>⚡</Text>
          <Text style={styles.structureLabel}>Gerador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.structureBtn}
          onPress={() => dispatch({ type: "APPLY_STRUCTURE", payload: "fazenda" })}
        >
          <Text style={styles.structureEmoji}>🌿</Text>
          <Text style={styles.structureLabel}>Fazenda de O₂</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.timer}>⏱️ {state.time}s</Text>
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