import { useEffect, useReducer, useRef } from "react"
import { AppState } from "react-native"
import { gameReducer, initialState } from "../engine/gameReducer"

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    startLoop()

    const subscription = AppState.addEventListener("change", nextState => {
      if (appState.current.match(/active/) && nextState === "background") {
        stopLoop()
      }

      if (appState.current.match(/background/) && nextState === "active") {
        startLoop()
      }

      appState.current = nextState
    })

    return () => {
      stopLoop()
      subscription.remove()
    }
  }, [])

  function startLoop() {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      dispatch({ type: "TICK" })
    }, 1000)
  }

  function stopLoop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return {
    state,
    dispatch
  }
}