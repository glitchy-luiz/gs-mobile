import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { loginUser, translateFirebaseError } from '../firebase/authService';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});  // erros inline por campo
  const [globalError, setGlobalError] = useState(''); // erro geral (ex: credencial errada)

  function validate() {
    const e = {}
    if (!email.trim())              e.email    = 'Email obrigatório'
    else if (!isValidEmail(email))  e.email    = 'Formato de email inválido'
    if (!password.trim())           e.password = 'Senha obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleLogin() {
    setGlobalError('')
    if (!validate()) return

    try {
      setLoading(true)
      await loginUser(email.trim(), password)
      navigation.navigate('Home')
    } catch (error) {
      setGlobalError(translateFirebaseError(error.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🪐 Exo-Survival</Text>
      <Text style={styles.subtitle}>Entre para iniciar sua missão</Text>

      {globalError ? (
        <View style={styles.globalError}>
          <Text style={styles.globalErrorText}>⚠️ {globalError}</Text>
        </View>
      ) : null}

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: '' })) }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Senha"
        placeholderTextColor="#555"
        value={password}
        onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: '' })) }}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.link}>Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
        <Text style={styles.linkMuted}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', padding: 24 },
  title:            { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle:         { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 40 },
  globalError:      { backgroundColor: '#2a1a1a', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e57373' },
  globalErrorText:  { color: '#e57373', fontSize: 14 },
  input:            { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 4 },
  inputError:       { borderColor: '#e57373' },
  fieldError:       { color: '#e57373', fontSize: 12, marginBottom: 12, marginLeft: 4 },
  button:           { backgroundColor: '#4a90e2', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  buttonDisabled:   { opacity: 0.5 },
  buttonText:       { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link:             { color: '#888', textAlign: 'center', marginBottom: 12 },
  linkBold:         { color: '#4a90e2', fontWeight: 'bold' },
  linkMuted:        { color: '#555', textAlign: 'center', fontSize: 13 },
});