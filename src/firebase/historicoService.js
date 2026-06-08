import { push, ref, get, query, orderByChild, set } from 'firebase/database';
import { db } from './config';

export async function salvarPartida(userId, partida) {
  if (!userId) throw new Error('Usuário não autenticado')
  if (!partida || !partida.time == null || !partida.planetData || !partida.multipliers) {
    throw new Error('Dados da partida incompletos')
  }

  const partidasRef = ref(db, `historico/${userId}`)
  const newPartidaRef = push(partidasRef)   // gera a ref

  // Corrigido: era push(partidasRef, dados) após push(partidasRef)
  // o que causava dois registros por partida
  await set(newPartidaRef, {
    ...partida,
    timestamp: Date.now(),
  })

  return newPartidaRef.key
}

export async function buscarHistorico(userId) {
  if (!userId) throw new Error('Usuário não autenticado')

  const partidasRef = query(
    ref(db, `historico/${userId}`),
    orderByChild('timestamp')
  )

  const snapshot = await get(partidasRef)

  if (!snapshot.exists()) return []

  const partidas = []
  snapshot.forEach(child => {
    const val = child.val()
    // Ignora registros corrompidos que não têm os campos esperados
    if (val && val.timestamp && val.time != null && val.planetData && val.multipliers) {
      partidas.unshift({ id: child.key, ...val })
    }
  })

  return partidas
}