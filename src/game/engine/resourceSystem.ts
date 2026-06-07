import { DifficultyMultipliers, GameState, ResourceEffect } from "../types/gameTypes"

const BASE_DRAIN = {
  oxigenio: -1,
  comida:   -0.5,
  energia:  -2,
}

const clamp = (value: number) => Math.max(0, Math.min(100, value))

export function updateResources(
  state: GameState,
  multipliers: DifficultyMultipliers  // ← novo parâmetro
): GameState {
  const newResources = {
    oxigenio: clamp(state.resources.oxigenio + BASE_DRAIN.oxigenio * multipliers.oxigenio),
    comida:   clamp(state.resources.comida   + BASE_DRAIN.comida   * multipliers.comida),
    energia:  clamp(state.resources.energia  + BASE_DRAIN.energia  * multipliers.energia),
  }

  const gameOver =
    newResources.oxigenio <= 0 ||
    newResources.comida   <= 0 ||
    newResources.energia  <= 0

  return {
    ...state,
    resources: newResources,
    time: state.time + 1,
    gameOver,
  }
}

export function applyStructureEffect(state: GameState, effect: ResourceEffect): GameState {
  const newResources = {
    oxigenio: clamp(state.resources.oxigenio + (effect.oxigenio || 0)),
    comida:   clamp(state.resources.comida   + (effect.comida   || 0)),
    energia:  clamp(state.resources.energia  + (effect.energia  || 0)),
  }
  return { ...state, resources: newResources }
}