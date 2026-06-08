import { GameState, GameAction, DifficultyMultipliers } from "../types/gameTypes"
import { updateResources, applyStructureEffect } from "./resourceSystem"
import { structures } from "../data/structure"

export const initialState: GameState = {
  resources: { oxigenio: 100, comida: 100, energia: 100 },
  time: 0,
  gameOver: false,
  achievements: {},
  sismicLevel: 0,
}

// O reducer agora é uma factory que recebe os multipliers
// e devolve o reducer já configurado com eles
export function makeGameReducer(multipliers: DifficultyMultipliers) {
  return function gameReducer(state: GameState, action: GameAction): GameState {
    if (state.gameOver && action.type !== "RESET") return state

    switch (action.type) {
      case "TICK":
        return updateResources(state, multipliers)  // ← passa multipliers

      case "SET_SISMIC_LEVEL":
        return { ...state, sismicLevel: action.payload }

      case "APPLY_STRUCTURE":
        const structure = structures[action.payload as keyof typeof structures]
        return applyStructureEffect(state, structure.efeito)

      case "RESET":
        return initialState

      default:
        return state
    }
  }
}