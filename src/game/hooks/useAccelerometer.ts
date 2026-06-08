import { useEffect, useRef } from "react"
import { Accelerometer } from "expo-sensors"

type Options = {
  enabled: boolean
  gravity: number
  onSismicChange: (level: number) => void
}

// Planetas com gravidade alta são geologicamente mais ativos —
// a sensibilidade do acelerômetro aumenta com a gravidade do planeta
function calcSensitivity(gravity: number): number {
  // gravidade 1g  → sensitivity 1.0 (referência terrestre)
  // gravidade 0.1g → sensitivity 0.5 (menos ativo)
  // gravidade 10g  → sensitivity 2.0 (muito mais ativo)
  return Math.max(0.5, gravity / 5)
}

export function useAccelerometer({ enabled, gravity, onSismicChange }: Options) {
  const smoothedLevel = useRef(0)
  const sensitivity = calcSensitivity(gravity)

  useEffect(() => {
    if (!enabled) {
      Accelerometer.removeAllListeners()
      onSismicChange(0)
      return
    }

    Accelerometer.setUpdateInterval(150)

    const subscription = Accelerometer.addListener(({ x }) => {
      // x vai de -1 (inclinado para esquerda) até +1 (direita)
      // Math.abs porque ambos os lados ativam a sísmica
      const rawTilt = Math.min(Math.abs(x) * sensitivity, 1)

      // Suavização: 80% do valor anterior + 20% do novo
      // evita que a barra fique pulando com o tremor natural das mãos
      smoothedLevel.current = smoothedLevel.current * 0.8 + rawTilt * 0.2

      // Arredonda para 2 casas para não disparar renders desnecessários
      const rounded = Math.round(smoothedLevel.current * 100) / 100
      onSismicChange(rounded)
    })

    return () => {
      subscription.remove()
      onSismicChange(0)
    }
  }, [enabled, gravity])
}