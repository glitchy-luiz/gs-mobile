import { DifficultyMultipliers, PlanetData } from "../types/gameTypes"

// Ranges extremos de referência (sem backend por ora)
const RANGES = {
  temperatura:         { min: -257, max: 550 },
  gravidade:           { min: 0.1,  max: 10  },
  pressaoAtmosferica:  { min: 0,    max: 100 },
}

/**
 * Normaliza um valor para 0-1 dentro do range.
 * 0.5 = centro "habitável", 0 ou 1 = extremo.
 */
function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min)
}

/**
 * Distância do centro (0.5), de 0 a 1.
 * 0 = condição ideal, 1 = condição extrema.
 */
function extremeness(normalized: number): number {
  return Math.abs(normalized - 0.5) * 2
}

/**
 * Converte extremeness em multiplicador de decaimento.
 * Extremeness 0 → multiplier 0.5 (condição ideal, cai mais devagar)
 * Extremeness 0.5 → multiplier 1.0 (condição média, decaimento normal)
 * Extremeness 1 → multiplier 2.5 (condição extrema, cai muito mais rápido)
 */
function toMultiplier(ext: number): number {
  return 0.5 + ext * 2
}

export function calcDifficulty(planet: PlanetData): DifficultyMultipliers {
  const tempNorm  = normalize(planet.temperatura,        RANGES.temperatura.min,        RANGES.temperatura.max)
  const gravNorm  = normalize(planet.gravidade,          RANGES.gravidade.min,          RANGES.gravidade.max)
  const presNorm  = normalize(planet.pressaoAtmosferica, RANGES.pressaoAtmosferica.min, RANGES.pressaoAtmosferica.max)

  const tempExt = extremeness(tempNorm)
  const gravExt = extremeness(gravNorm)
  const presExt = extremeness(presNorm)

  return {
    // Oxigênio: pressão atmosférica é o fator dominante
    // Gravidade alta também consome mais O₂
    oxigenio: toMultiplier(presExt * 0.7 + gravExt * 0.3),

    // Comida: temperatura extrema estraga mais rápido
    // Gravidade alta aumenta esforço físico
    comida: toMultiplier(tempExt * 0.6 + gravExt * 0.4),

    // Energia: temperatura e gravidade dominam
    // Frio extremo exige aquecimento, calor extremo exige resfriamento
    energia: toMultiplier(tempExt * 0.5 + gravExt * 0.5),
  }
}