import React from "react"
import { View, Text, Button } from "react-native"
import { useGame } from "../game/hooks/useGame"

export default function GameScreen() {
  const { state, dispatch } = useGame()

  return (
    <View>
      <Text>Oxigênio: {state.resources.oxigenio}</Text>
      <Text>Comida: {state.resources.comida}</Text>
      <Text>Energia: {state.resources.energia}</Text>

      <Button title="Cozinha" onPress={() => dispatch({ type: "APPLY_STRUCTURE", payload: "cozinha" })} />
      <Button title="Gerador" onPress={() => dispatch({ type: "APPLY_STRUCTURE", payload: "gerador" })} />
      <Button title="Fazenda" onPress={() => dispatch({ type: "APPLY_STRUCTURE", payload: "fazenda" })} />

      {state.gameOver && <Text>GAME OVER</Text>}
    </View>
  )
}