import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"

type Props = {
  level: number
}

function getLevelColor(level: number): string {
  if (level < 0.3) return "#81C784"
  if (level < 0.6) return "#FFD54F"
  if (level < 0.8) return "#FF8A65"
  return "#e57373"
}

function getLevelLabel(level: number): string {
  if (level < 0.3) return "Estável"
  if (level < 0.6) return "Moderada"
  if (level < 0.8) return "Alta"
  return "Crítica"
}

export default function SismicBar({ level }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: level,
      duration: 150,
      useNativeDriver: false,
    }).start()
  }, [level])

  const color = getLevelColor(level)
  const label = getLevelLabel(level)

  const widthInterpolated = animatedWidth.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌍 Atividade Sísmica</Text>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { width: widthInterpolated, backgroundColor: color }
          ]}
        />
      </View>

      <Text style={styles.hint}>
        Incline o celular para aumentar a atividade sísmica
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title:  { color: "#aaa", fontSize: 12, fontWeight: "600" },
  label:  { fontSize: 12, fontWeight: "bold" },
  track: {
    height: 8,
    backgroundColor: "#0a0a0f",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
  hint: { color: "#444", fontSize: 11 },
})