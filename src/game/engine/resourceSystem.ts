import { DifficultyMultipliers, GameState, ResourceEffect, ResourceKey } from "../types/gameTypes"

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
  const sismicGactor = 1 + state.sismicLevel

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

export function applyStructureEffect(
  state: GameState,
  effect: ResourceEffect,
  sismicLevel: number = 0
): GameState {
  const sismicCostFactor = 1 + sismicLevel * 0.5  // até +50% nos custos

  const newResources = { ...state.resources }

  for (const key of Object.keys(effect) as ResourceKey[]) {
    const value = effect[key] ?? 0
    const adjusted = value < 0
      ? value * sismicCostFactor
      : value
    newResources[key] = clamp(newResources[key] + adjusted)
  }

  return { ...state, resources: newResources }
}