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
  const [showTip, setShowTip] = useState(true)

  useAccelerometer({
    enabled: !state.gameOver,
    gravity: planetData.gravidade,
    onSismicChange: (level) => {
      dispatch({ type: "SET_SISMIC_LEVEL", payload: level })
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => setShowTip(false), 5000)
    return () => clearTimeout(timer)
  }, [])

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

      {showTip && (
        <TouchableOpacity style={styles.tipCard} onPress={() => setShowTip(false)}>
          <Text style={styles.tipTitle}>🌍 Condições do seu planeta</Text>
          <Text style={styles.tipText}>
            Com gravidade de {planetData.gravidade}g,
            {planetData.gravidade > 3
              ? " este planeta tem alta atividade tectônica. Manter o celular inclinado irá drenar seus recursos rapidamente."
              : planetData.gravidade < 1
              ? " este planeta é geologicamente estável. A atividade sísmica quase não te afetará."
              : " a atividade sísmica é similar à da Terra. Cuidado com inclinações prolongadas."}
          </Text>
          <Text style={styles.tipDismiss}>Toque para fechar</Text>
        </TouchableOpacity>
      )}

      {/* ← gravity passado aqui */}
      <SismicBar level={state.sismicLevel} gravity={planetData.gravidade} />

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

      {/* ← planetData passado como prop */}
      <EfeitosPanel
        structureKey={selectedStructure}
        sismicLevel={state.sismicLevel}
        planetData={planetData}
      />

      <Text style={styles.timer}>⏱️ {state.time}s</Text>
    </View>
  )
}

function EfeitosPanel({
  structureKey,
  sismicLevel,
  planetData,  // ← recebe planetData como prop
}: {
  structureKey: StructureKey | null
  sismicLevel: number
  planetData: PlanetData
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
          ⚠️ Tremores ativos — custos aumentados em {Math.round(sismicLevel * 50)}%{"\n"}
          <Text style={{ color: "#555", fontSize: 10 }}>
            Planetas com gravidade {planetData.gravidade}g têm crosta mais densa e
            {planetData.gravidade > 3 ? " maior atividade tectônica" : " atividade tectônica moderada"}
          </Text>
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
  tipCard: {
    marginHorizontal: 16, marginTop: 8, padding: 14,
    backgroundColor: "#1a2a3a", borderRadius: 12,
    borderWidth: 1, borderColor: "#4a90e2",
  },
  tipTitle:   { color: "#4a90e2", fontSize: 13, fontWeight: "bold", marginBottom: 6 },
  tipText:    { color: "#ddd", fontSize: 13, lineHeight: 20 },
  tipDismiss: { color: "#555", fontSize: 11, marginTop: 8, textAlign: "right" },
})

const efeitosStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16, marginTop: 12, padding: 14,
    backgroundColor: "#1a1a2e", borderRadius: 12,
    borderWidth: 1, borderColor: "#333", minHeight: 70, justifyContent: "center",
  },
  title:     { color: "#aaa", fontSize: 12, fontWeight: "600", marginBottom: 8 },
  hint:      { color: "#444", fontSize: 13, textAlign: "center" },
  row:       { flexDirection: "row", gap: 24 },
  item:      { alignItems: "center" },
  value:     { fontSize: 18, fontWeight: "bold" },
  label:     { color: "#888", fontSize: 11, marginTop: 2 },
  sismicTag: { fontSize: 12 },
  warning:   { color: "#FF8A65", fontSize: 11, marginTop: 8 },
})