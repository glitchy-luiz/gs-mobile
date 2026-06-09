import { structures } from "../data/structure"
// LEMBRETE. conquistas, ações especiais e cooldown não foram implementados no momento (próximos avanços que pra seguir)

// ─── Planeta ───────────────────────────────────────────────────────────────

export type PlanetData = {
  temperatura: number
  gravidade: number
  pressaoAtmosferica: number
}

// ─── Dificuldade ───────────────────────────────────────────────────────────

export type DifficultyMultipliers = {
  oxigenio: number
  comida: number
  energia: number
}

// ─── Recursos ──────────────────────────────────────────────────────────────

export type ResourceKey = keyof Resources

export type Resources = {
  oxigenio: number
  comida: number
  energia: number
}

export type ResourceEffect = Partial<Record<ResourceKey, number>>

// ─── Estruturas ────────────────────────────────────────────────────────────

export type StructureKey = keyof typeof structures

export type StructureAction = {
  id: string
  label: string
  cooldown: number
  effects: ResourceEffect
  educationalText: string
}

export type Structure = {
  name: string
  efeito: ResourceEffect
  actions?: StructureAction[]
}

// ─── Conquistas ────────────────────────────────────────────────────────────

export type Achievement = {
  id: string
  label: string
  description: string
  check: (state: GameState) => boolean
}

export type UnlockedAchievements = Record<string, boolean>

// ─── Estado do jogo ────────────────────────────────────────────────────────

export type GameState = {
  resources: Resources
  time: number
  gameOver: boolean
  achievements: UnlockedAchievements
  sismicLevel: number
}

// ─── Resumo pós-partida ────────────────────────────────────────────────────

// Passado via route.params para a GameOverScreen
export type GameSummary = {
  time: number
  planetData: PlanetData
  multipliers: DifficultyMultipliers
  achievements: UnlockedAchievements
}

// ─── Actions do reducer ────────────────────────────────────────────────────

export type GameAction =
  | { type: "TICK" }
  | { type: "APPLY_STRUCTURE"; payload: StructureKey }
  | { type: "UNLOCK_ACHIEVEMENT"; payload: string }
  | { type: "SET_SISMIC_LEVEL"; payload: number }
  | { type: "RESET" }