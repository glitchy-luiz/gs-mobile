import { useEffect, useRef } from "react"
import { Platform } from "react-native"
import { Accelerometer } from "expo-sensors"

type Options = {
  enabled: boolean
  gravity: number
  onSismicChange: (level: number) => void
  onPermissionDenied?: () => void
}

function calcSensitivity(gravity: number): number {
  return Math.max(0.5, gravity / 5)
}

export function useAccelerometer({ enabled, gravity, onSismicChange, onPermissionDenied }: Options) {
  const smoothedLevel = useRef(0)
  const sensitivity = calcSensitivity(gravity)

  useEffect(() => {
    if (Platform.OS === "web") {
      onSismicChange(0)
      return
    }

    if (!enabled) {
      Accelerometer.removeAllListeners()
      onSismicChange(0)
      return
    }

    let subscription: any = null

    async function init() {
      try {
        const { status } = await Accelerometer.requestPermissionsAsync()

        if (status !== 'granted') {
          onPermissionDenied?.()
          onSismicChange(0)
          return
        }

        Accelerometer.setUpdateInterval(150)

        subscription = Accelerometer.addListener(({ x }) => {
          const rawTilt = Math.min(Math.abs(x) * sensitivity, 1)
          smoothedLevel.current = smoothedLevel.current * 0.8 + rawTilt * 0.2
          const rounded = Math.round(smoothedLevel.current * 100) / 100
          onSismicChange(rounded)
        })
      } catch (e) {
        onSismicChange(0)
      }
    }

    init()

    return () => {
      subscription?.remove()
      onSismicChange(0)
    }
  }, [enabled, gravity])
}