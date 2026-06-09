import { useEffect, useReducer, useRef } from "react"
import { AppState } from "react-native"
import { makeGameReducer, initialState } from "../engine/gameReducer"
import { calcDifficulty } from "../engine/difficultSystem"
import { PlanetData } from "../types/gameTypes"

export function useGame(planetData: PlanetData) {
  const multipliers = useRef(calcDifficulty(planetData)).current
  const reducer = useRef(makeGameReducer(multipliers)).current

  const [state, dispatch] = useReducer(reducer, initialState)

  const intervalRef  = useRef<NodeJS.Timeout | null>(null)
  const appStateRef  = useRef(AppState.currentState)
  const gameOverRef  = useRef(false)

  useEffect(() => {
    gameOverRef.current = state.gameOver
    if (state.gameOver) stopLoop()
  }, [state.gameOver])

  useEffect(() => {
    startLoop()

    const subscription = AppState.addEventListener("change", next => {
      if (appStateRef.current.match(/active/) && next === "background") stopLoop()
      if (appStateRef.current.match(/background/) && next === "active") {
        if (!gameOverRef.current) startLoop()
      }
      appStateRef.current = next
    })

    return () => { stopLoop(); subscription.remove() }
  }, [])

  function startLoop() {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000)
  }

  function stopLoop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return { state, dispatch, multipliers }
}