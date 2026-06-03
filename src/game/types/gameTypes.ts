export type Resources = {
  oxigenio: number
  comida: number
  energia: number
}

export type GameState = {
  resources: Resources
  time: number
  gameOver: boolean
}

export type GameAction =
  | { type: "TICK" }
  | { type: "APPLY_STRUCTURE"; payload: keyof typeof import("../data/structure").structures }
  | { type: "RESET" }