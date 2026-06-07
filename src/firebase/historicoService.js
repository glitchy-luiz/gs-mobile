import { push, ref, get, query, orderByChild } from 'firebase/database';
import { db } from './config';

/**
 * Salva uma partida no histórico do usuário.
 * Estrutura no Realtime Database:
 * historico/
 *   {userId}/
 *     {partidaId}/
 *       timestamp, time, planetData, multipliers
 */
export async function salvarPartida(userId, partida) {
  const partidasRef = ref(db, `historico/${userId}`);
  const newPartidaRef = push(partidasRef);
  await push(partidasRef, {
    ...partida,
    timestamp: Date.now(),
  });
  return newPartidaRef.key;
}

/**
 * Busca todas as partidas do usuário, ordenadas da mais recente.
 * Retorna array de objetos { id, ...dadosDaPartida }
 */
export async function buscarHistorico(userId) {
  const partidasRef = query(
    ref(db, `historico/${userId}`),
    orderByChild('timestamp')
  );

  const snapshot = await get(partidasRef);

  if (!snapshot.exists()) return [];

  const partidas = [];
  snapshot.forEach(child => {
    partidas.unshift({ id: child.key, ...child.val() }); // unshift = mais recente primeiro
  });

  return partidas;
}