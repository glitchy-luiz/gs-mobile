import React, { useState, useEffect } from "react"
import {
  View,
  ImageBackground,
  StyleSheet,
  Pressable,
  Text,
  Modal,
  TouchableOpacity
} from "react-native"

import { useGame } from "../game/hooks/useGame"
import ResourceHeader from "../components/ResourceHeader"

export default function GameScreen({ navigation }) {
  const { state, dispatch } = useGame()
  const [selectedStructure, setSelectedStructure] = useState(null)
  const [showGameOver, setShowGameOver] = useState(false)

  const handlePress = (type) => {
      if(selectedStructure == type && selectedStructure != null){
          setSelectedStructure(null)
        } else {
            setSelectedStructure(type)
        }
  }

  const executeAction = () => {
    if (selectedStructure) {
      dispatch({ type: "APPLY_STRUCTURE", payload: selectedStructure })
    }
    setSelectedStructure(null)
  }

  // detecta game over
useEffect(() => {
    if (state.gameOver) {
        setShowGameOver(true)
    }
}, [state.gameOver])


  return (
    <View style={styles.container}>

      <ResourceHeader resources={state.resources} />

      <ImageBackground
        source={require("../../assets/icon.png")}
        style={styles.map}
        resizeMode="cover"
      >
        {/* BOTÕES INVISÍVEIS */}
        <Pressable style={styles.cozinha} onPress={() => handlePress("cozinha")} />
        <Pressable style={styles.gerador} onPress={() => handlePress("gerador")} />
        <Pressable style={styles.fazenda} onPress={() => handlePress("fazenda")} />
      </ImageBackground>

      {selectedStructure && (
        <View style={styles.bottomPanel}>
          <Text style={styles.title}>{selectedStructure.toUpperCase()}</Text>

          <Text style={styles.info}>
            {selectedStructure === "cozinha" &&
              "Comida +20 | Energia -5 | Oxigênio -10"}

            {selectedStructure === "gerador" &&
              "Energia +25 | Oxigênio -5"}

            {selectedStructure === "fazenda" &&
              "Comida +15 | Energia -10 | Oxigênio -5"}
          </Text>

          <TouchableOpacity style={styles.actionButton} onPress={executeAction}>
            <Text style={{ color: "#000" }}>Executar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL GAME OVER */}
      <Modal visible={showGameOver} transparent animationType="fade" onRequestClose={() => setShowGameOver(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.gameOver}>GAME OVER</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                  setShowGameOver(false)
                  navigation.navigate("GameOver")
                }}
            >
              <Text>Ver Resultados</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                  setShowGameOver(false)
                  navigation.navigate("Home")
                }}
            >
              <Text>Voltar ao Início</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  map: {
    flex: 1,
    justifyContent: "flex-end"
  },

  // posições dos botões (ajuste fino depois)
  cozinha: {
    position: "absolute",
    bottom: 100,
    left: 50,
    width: 80,
    height: 80,
    //tirar quando botar imagem ofcial
    backgroundColor: "rgba(255, 0, 0, 0.3)", // vermelho
    borderWidth: 1,
    borderColor: "#ff0000"
  },
  gerador: {
    position: "absolute",
    bottom: 120,
    right: 50,
    width: 80,
    height: 80,
    //tirar quando botar imagem ofcial
    backgroundColor: "rgba(0, 255, 0, 0.3)", // verde
    borderWidth: 1,
    borderColor: "#00ff00"
  },
  fazenda: {
    position: "absolute",
    bottom: 200,
    left: 150,
    width: 80,
    height: 80,
    //tirar quando botar imagem ofcial
    backgroundColor: "rgba(0, 0, 255, 0.3)", // azul
    borderWidth: 1,
    borderColor: "#0000ff"
  },

  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    padding: 20
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  info: {
    color: "#aaa",
    marginTop: 5
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center"
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    backgroundColor: "#222",
    padding: 30,
    borderRadius: 10,
    width: 250
  },
  gameOver: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 10,
    alignItems: "center"
  }
})