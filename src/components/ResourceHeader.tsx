import React from "react"
import { View, StyleSheet } from "react-native"
import ResourceCircle from "./ResourceCircle"

export default function ResourceHeader({ resources }: any) {
  return (
    <View style={styles.container}>
      <ResourceCircle label="Oxigênio" value={resources.oxigenio} color="#4FC3F7" />
      <ResourceCircle label="Comida" value={resources.comida} color="#81C784" />
      <ResourceCircle label="Energia" value={resources.energia} color="#FFD54F" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#111"
  }
})