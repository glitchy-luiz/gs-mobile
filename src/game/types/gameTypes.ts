import { structures } from "../data/structure"

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

// Efeito que uma ação de estrutura causa nos recursos
// Partial porque nem toda estrutura afeta todos os recursos
export type ResourceEffect = Partial<Record<ResourceKey, number>>

// ─── Estruturas ────────────────────────────────────────────────────────────

export type StructureKey = keyof typeof structures

export type StructureAction = {
  id: string
  label: string
  cooldown: number          // ms entre usos
  effects: ResourceEffect
  educationalText: string   // exibido no modal antes de confirmar a ação
}

export type Structure = {
  name: string
  efeito: ResourceEffect    // decaimento passivo/efeito direto ao ativar
  actions?: StructureAction[] // ações futuras via modal (opcional no MVP)
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
  time: number              // segundos decorridos
  gameOver: boolean
  achievements: UnlockedAchievements
  sismicLevel: number        // 0 = estável, 1 = atividade máxima
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