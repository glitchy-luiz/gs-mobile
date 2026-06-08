import { useState, useEffect, useCallback, useRef } from "react"
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView,
  Platform, ActivityIndicator, RefreshControl,
  Alert, ScrollView
} from "react-native"
import { getAuth } from "firebase/auth"
import { buscarHistorico } from "../firebase/historicoService"
import HistoricoCard from "../components/HistoricoCard"

type PlanetData = {
  temperatura: string
  gravidade: string
  pressaoAtmosferica: string
}

const LIMITS = {
  temperatura:        { min: -257, max: 550 },
  gravidade:          { min: 0.1,  max: 10  },
  pressaoAtmosferica: { min: 0,    max: 100 },
}

export default function HomeScreen({ navigation }: any) {
  const [planet, setPlanet] = useState<PlanetData>({
    temperatura: "",
    gravidade: "",
    pressaoAtmosferica: "",
  })
  const [historico, setHistorico] = useState<any[]>([])
  const [loadingHistorico, setLoadingHistorico] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function carregarHistorico() {
    try {
      const user = getAuth().currentUser
      if (!user) return
      const dados = await buscarHistorico(user.uid)
      setHistorico(dados)
    } catch (e) {
      console.error("Erro ao carregar histórico:", e)
    } finally {
      setLoadingHistorico(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregarHistorico)
    return unsubscribe
  }, [navigation])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    carregarHistorico()
  }, [])

  function handleChange(field: keyof PlanetData, value: string) {
    setPlanet(prev => ({ ...prev, [field]: value }))
  }

  function handleStart() {
    const temp = parseFloat(planet.temperatura)
    const grav = parseFloat(planet.gravidade)
    const pres = parseFloat(planet.pressaoAtmosferica)

    if (isNaN(temp) || isNaN(grav) || isNaN(pres)) {
      Alert.alert("Campos incompletos", "Preencha todos os campos com valores numéricos.")
      return
    }
    if (temp < LIMITS.temperatura.min || temp > LIMITS.temperatura.max) {
      Alert.alert("Temperatura inválida", `Insira um valor entre ${LIMITS.temperatura.min}°C e ${LIMITS.temperatura.max}°C.`)
      return
    }
    if (grav < LIMITS.gravidade.min || grav > LIMITS.gravidade.max) {
      Alert.alert("Gravidade inválida", `Insira um valor entre ${LIMITS.gravidade.min}g e ${LIMITS.gravidade.max}g.`)
      return
    }
    if (pres < LIMITS.pressaoAtmosferica.min || pres > LIMITS.pressaoAtmosferica.max) {
      Alert.alert("Pressão inválida", `Insira um valor entre ${LIMITS.pressaoAtmosferica.min}% e ${LIMITS.pressaoAtmosferica.max}%.`)
      return
    }

    navigation.navigate("Game", {
      planetData: { temperatura: temp, gravidade: grav, pressaoAtmosferica: pres }
    })
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4a90e2"
          />
        }
      >
        {/* ── Formulário ── */}
        <Text style={styles.title}>Criar Planeta</Text>
        <Text style={styles.subtitle}>
          Configure as condições do seu planeta antes de começar a sobreviver.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🌡️ Temperatura (°C)</Text>
          <Text style={styles.hint}>De -257°C até 550°C</Text>
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
          <Text style={styles.hint}>De 0.1g até 10g</Text>
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
          <Text style={styles.hint}>0% = sem atmosfera, 100% = máxima</Text>
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

        {/* ── Histórico ── */}
        <Text style={styles.sectionTitle}>Histórico de Partidas</Text>

        {loadingHistorico ? (
          <ActivityIndicator color="#4a90e2" style={{ marginTop: 20 }} />
        ) : historico.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma partida registrada ainda.{"\n"}Jogue sua primeira missão!
          </Text>
        ) : (
          historico.map(item => <HistoricoCard key={item.id} partida={item} />)
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrapper:      { flex: 1, backgroundColor: "#0a0a0f" },
  container:    { padding: 24, paddingBottom: 48 },
  title:        { fontSize: 28, fontWeight: "bold", color: "#fff", marginTop: 40, marginBottom: 8 },
  subtitle:     { fontSize: 14, color: "#888", marginBottom: 32 },
  fieldGroup:   { marginBottom: 24 },
  label:        { fontSize: 16, color: "#ddd", fontWeight: "600", marginBottom: 4 },
  hint:         { fontSize: 12, color: "#555", marginBottom: 8 },
  input: {
    backgroundColor: "#1a1a2e", color: "#fff", borderRadius: 10,
    padding: 14, fontSize: 16, borderWidth: 1, borderColor: "#333",
  },
  button:       { backgroundColor: "#4a90e2", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonText:   { color: "#fff", fontSize: 18, fontWeight: "bold" },
  logoutButton: { marginTop: 20, alignItems: "center", marginBottom: 8 },
  logoutText:   { color: "#555", fontSize: 14 },
  sectionTitle: { fontSize: 18, color: "#fff", fontWeight: "bold", marginTop: 32, marginBottom: 16 },
  emptyText:    { color: "#555", textAlign: "center", marginTop: 12, lineHeight: 22 },
})