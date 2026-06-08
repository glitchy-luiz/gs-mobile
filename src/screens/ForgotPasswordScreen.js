import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { resetUserPassword, translateFirebaseError } from '../firebase/authService';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [emailError, setEmailError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess]   = useState(false);

  async function handleResetPassword() {
    setEmailError('')
    setGlobalError('')

    if (!email.trim()) {
      setEmailError('Email obrigatório')
      return
    }
    if (!isValidEmail(email)) {
      setEmailError('Formato de email inválido')
      return
    }

    try {
      setLoading(true)
      await resetUserPassword(email.trim())
      setSuccess(true)  // mostra mensagem inline em vez de Alert
    } catch (error) {
      setGlobalError(translateFirebaseError(error.code))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📬 Email enviado</Text>
        <Text style={styles.subtitle}>
          Verifique sua caixa de entrada em{'\n'}
          <Text style={{ color: '#4a90e2' }}>{email}</Text>
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Informe seu email e enviaremos as instruções de recuperação.
      </Text>

      {globalError ? (
        <View style={styles.globalError}>
          <Text style={styles.globalErrorText}>⚠️ {globalError}</Text>
        </View>
      ) : null}

      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={v => { setEmail(v); setEmailError('') }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar instruções'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', padding: 24 },
  title:           { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle:        { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  globalError:     { backgroundColor: '#2a1a1a', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e57373' },
  globalErrorText: { color: '#e57373', fontSize: 14 },
  input:           { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 4 },
  inputError:      { borderColor: '#e57373' },
  fieldError:      { color: '#e57373', fontSize: 12, marginBottom: 12, marginLeft: 4 },
  button:          { backgroundColor: '#4a90e2', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  buttonDisabled:  { opacity: 0.5 },
  buttonText:      { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link:            { color: '#555', textAlign: 'center', fontSize: 14 },
});