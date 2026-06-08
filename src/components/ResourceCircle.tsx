import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"

type Props = {
  label: string
  value: number
  color: string
}

export default function ResourceCircle({ label, value, color }: Props) {
  const size = 80
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const progress = value / 100
  const strokeDashoffset = circumference - circumference * progress

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* fundo */}
        <Circle
          stroke="#333"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* progresso */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10
  },
  textContainer: {
    position: "absolute",
    alignItems: "center"
  },
  label: {
    fontSize: 10,
    color: "#aaa"
  },
  value: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold"
  }
})