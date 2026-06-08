import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';

// Traduz os códigos de erro do Firebase para mensagens em português
export function translateFirebaseError(code) {
  const errors = {
    'auth/invalid-email':            'Email inválido. Verifique o formato.',
    'auth/user-disabled':            'Esta conta foi desativada.',
    'auth/user-not-found':           'Nenhuma conta encontrada com este email.',
    'auth/wrong-password':           'Senha incorreta.',
    'auth/email-already-in-use':     'Este email já está cadastrado.',
    'auth/weak-password':            'A senha deve ter pelo menos 6 caracteres.',
    'auth/too-many-requests':        'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed':   'Sem conexão. Verifique sua internet.',
    'auth/invalid-credential':       'Email ou senha incorretos.',
    'auth/missing-password':         'Informe a senha.',
  }
  return errors[code] ?? 'Ocorreu um erro inesperado. Tente novamente.'
}

export async function registerUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  return userCredential
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential
}

export async function resetUserPassword(email) {
  await sendPasswordResetEmail(auth, email)
}