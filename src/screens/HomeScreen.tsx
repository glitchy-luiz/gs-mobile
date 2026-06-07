import { useState } from "react"
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, KeyboardAvoidingView, Platform
} from "react-native"

// Tipagem dos dados do planeta
type PlanetData = {
  temperatura: string
  gravidade: string
  pressaoAtmosferica: string
}

export default function HomeScreen({ navigation }: any) {
  const [planet, setPlanet] = useState<PlanetData>({
    temperatura: "",
    gravidade: "",
    pressaoAtmosferica: "",
  })

  function handleChange(field: keyof PlanetData, value: string) {
    setPlanet(prev => ({ ...prev, [field]: value }))
  }

  function handleStart() {
    const temp = parseFloat(planet.temperatura)
    const grav = parseFloat(planet.gravidade)
    const pres = parseFloat(planet.pressaoAtmosferica)

    // Validação básica
    if (isNaN(temp) || isNaN(grav) || isNaN(pres)) {
      alert("Preencha todos os campos com valores numéricos.")
      return
    }

    // Navega passando os dados para o GameScreen usar no difficulty system
    navigation.navigate("Game", {
      planetData: { temperatura: temp, gravidade: grav, pressaoAtmosferica: pres }
    })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar Planeta</Text>
        <Text style={styles.subtitle}>
          Configure as condições do seu planeta antes de começar a sobreviver.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🌡️ Temperatura (°C)</Text>
          <Text style={styles.hint}>De -257°C (quase zero absoluto) até 550°C</Text>
          <TextInput
            style={styles.input}
            placeholder="-257 a 550"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={planet.temperatura}
            onChangeText={v => handleChange("temperatura", v)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>⬇️ Gravidade (g)</Text>
          <Text style={styles.hint}>De 0.1g (quase sem gravidade) até 10g</Text>
          <TextInput
            style={styles.input}
            placeholder="0.1 a 10"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={planet.gravidade}
            onChangeText={v => handleChange("gravidade", v)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>💨 Pressão Atmosférica (%)</Text>
          <Text style={styles.hint}>0% = sem atmosfera, 100% = pressão máxima</Text>
          <TextInput
            style={styles.input}
            placeholder="0 a 100"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={planet.pressaoAtmosferica}
            onChangeText={v => handleChange("pressaoAtmosferica", v)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Iniciar Missão 🚀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: "#0a0a0f",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 32,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#ddd",
    fontWeight: "600",
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#4a90e2",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#555",
    fontSize: 14,
  },
})