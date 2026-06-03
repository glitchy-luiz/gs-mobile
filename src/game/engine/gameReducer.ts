import { GameState, GameAction } from "../types/gameTypes"
import { updateResources, applyStructureEffect } from "./resourceSystem"
import { structures } from "../data/structure"

export const initialState: GameState = {
  resources: {
    oxigenio: 100,
    comida: 100,
    energia: 100
  },
  time: 0,
  gameOver: false
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.gameOver && action.type !== "RESET") return state

  switch (action.type) {
    case "TICK":
      return updateResources(state)

    case "APPLY_STRUCTURE":
      const structure = structures[action.payload]
      return applyStructureEffect(state, structure.efeito)

    case "RESET":
      return initialState

    default:
      return state
  }
}