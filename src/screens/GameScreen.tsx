import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useGame } from "../game/hooks/useGame"
import { useAccelerometer } from "../game/hooks/useAccelerometer"
import { PlanetData, StructureKey } from "../game/types/gameTypes"
import { structures } from "../game/data/structure"
import ResourceHeader from "../components/ResourceHeader"
import SismicBar from "../components/SismicBar"

export default function GameScreen({ navigation, route }: any) {
  const planetData: PlanetData = route.params?.planetData ?? {
    temperatura: 20,
    gravidade: 1,
    pressaoAtmosferica: 50,
  }

  const { state, dispatch, multipliers } = useGame(planetData)
  const [selectedStructure, setSelectedStructure] = useState<StructureKey | null>(null)

  // Alimenta o sismicLevel no reducer a cada leitura do acelerômetro
  useAccelerometer({
    enabled: !state.gameOver,
    gravity: planetData.gravidade,
    onSismicChange: (level) => {
      dispatch({ type: "SET_SISMIC_LEVEL", payload: level })
    },
  })

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

      <SismicBar level={state.sismicLevel} />

      {/* Estruturas */}
      <View style={styles.structuresRow}>
        {(Object.keys(structures) as StructureKey[]).map(key => (
          <TouchableOpacity
            key={key}
            style={styles.structureBtn}
            onPress={() => {
              setSelectedStructure(key)
              dispatch({ type: "APPLY_STRUCTURE", payload: key })
            }}
          >
            <Text style={styles.structureEmoji}>
              {key === "cozinha" ? "🍳" : key === "gerador" ? "⚡" : "🌿"}
            </Text>
            <Text style={styles.structureLabel}>{structures[key].name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <EfeitosPanel structureKey={selectedStructure} sismicLevel={state.sismicLevel} />

      <Text style={styles.timer}>⏱️ {state.time}s</Text>
    </View>
  )
}

// EfeitosPanel atualizado para mostrar impacto da sísmica nos custos
function EfeitosPanel({
  structureKey,
  sismicLevel,
}: {
  structureKey: StructureKey | null
  sismicLevel: number
}) {
  if (!structureKey) {
    return (
      <View style={efeitosStyles.container}>
        <Text style={efeitosStyles.hint}>Toque em uma estrutura para ver seus efeitos</Text>
      </View>
    )
  }

  const structure = structures[structureKey]
  const labels: Record<string, string> = {
    oxigenio: "Oxigênio", comida: "Comida", energia: "Energia",
  }

  return (
    <View style={efeitosStyles.container}>
      <Text style={efeitosStyles.title}>{structure.name}</Text>
      <View style={efeitosStyles.row}>
        {Object.entries(structure.efeito).map(([key, value]) => {
          // Mostra o custo real considerando a sísmica atual
          const adjusted = value < 0
            ? Math.round(value * (1 + sismicLevel * 0.5))
            : value
          const changed = adjusted !== value

          return (
            <View key={key} style={efeitosStyles.item}>
              <Text style={[efeitosStyles.value, { color: adjusted > 0 ? "#81C784" : "#e57373" }]}>
                {adjusted > 0 ? `+${adjusted}` : adjusted}
                {changed && <Text style={efeitosStyles.sismicTag}> ⚠️</Text>}
              </Text>
              <Text style={efeitosStyles.label}>{labels[key] ?? key}</Text>
            </View>
          )
        })}
      </View>
      {sismicLevel > 0.3 && (
        <Text style={efeitosStyles.warning}>
          ⚠️ Atividade sísmica aumentando os custos em {Math.round(sismicLevel * 50)}%
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#0a0a0f" },
  structuresRow:  { flexDirection: "row", justifyContent: "space-around", marginTop: 16, paddingHorizontal: 16 },
  structureBtn:   { alignItems: "center", backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16, width: 100, borderWidth: 1, borderColor: "#333" },
  structureEmoji: { fontSize: 32 },
  structureLabel: { color: "#ddd", fontSize: 12, marginTop: 6, textAlign: "center" },
  timer:          { color: "#555", textAlign: "center", marginTop: 16, fontSize: 14 },
})

const efeitosStyles = StyleSheet.create({
  container:  { marginHorizontal: 16, marginTop: 12, padding: 14, backgroundColor: "#1a1a2e", borderRadius: 12, borderWidth: 1, borderColor: "#333", minHeight: 70, justifyContent: "center" },
  title:      { color: "#aaa", fontSize: 12, fontWeight: "600", marginBottom: 8 },
  hint:       { color: "#444", fontSize: 13, textAlign: "center" },
  row:        { flexDirection: "row", gap: 24 },
  item:       { alignItems: "center" },
  value:      { fontSize: 18, fontWeight: "bold" },
  label:      { color: "#888", fontSize: 11, marginTop: 2 },
  sismicTag:  { fontSize: 12 },
  warning:    { color: "#FF8A65", fontSize: 11, marginTop: 8 },
})