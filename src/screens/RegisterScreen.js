import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { registerUser, translateFirebaseError } from '../firebase/authService';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function RegisterScreen({ navigation }) {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const [globalError, setGlobalError] = useState('');

  function validate() {
    const e = {}
    if (!name.trim())                       e.name     = 'Nome obrigatório'
    if (!email.trim())                      e.email    = 'Email obrigatório'
    else if (!isValidEmail(email))          e.email    = 'Formato de email inválido'
    if (!password.trim())                   e.password = 'Senha obrigatória'
    else if (password.length < 6)           e.password = 'Mínimo de 6 caracteres'
    if (!confirm.trim())                    e.confirm  = 'Confirme a senha'
    else if (confirm !== password)          e.confirm  = 'As senhas não coincidem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleRegister() {
    setGlobalError('')
    if (!validate()) return

    try {
      setLoading(true)
      await registerUser(email.trim(), password)
      navigation.goBack()
    } catch (error) {
      setGlobalError(translateFirebaseError(error.code))
    } finally {
      setLoading(false)
    }
  }

  function field(value, setter, field, props = {}) {
    return (
      <>
        <TextInput
          style={[styles.input, errors[field] && styles.inputError]}
          placeholderTextColor="#555"
          value={value}
          onChangeText={v => { setter(v); setErrors(p => ({ ...p, [field]: '' })) }}
          {...props}
        />
        {errors[field] ? <Text style={styles.fieldError}>{errors[field]}</Text> : null}
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🪐 Criar Conta</Text>
      <Text style={styles.subtitle}>Prepare-se para explorar o universo</Text>

      {globalError ? (
        <View style={styles.globalError}>
          <Text style={styles.globalErrorText}>⚠️ {globalError}</Text>
        </View>
      ) : null}

      {field(name, setName, 'name', { placeholder: 'Nome' })}
      {field(email, setEmail, 'email', { placeholder: 'Email', autoCapitalize: 'none', keyboardType: 'email-address' })}
      {field(password, setPassword, 'password', { placeholder: 'Senha (mín. 6 caracteres)', secureTextEntry: true })}
      {field(confirm, setConfirm, 'confirm', { placeholder: 'Confirmar senha', secureTextEntry: true })}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Fazer login</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', padding: 24 },
  title:           { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle:        { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 40 },
  globalError:     { backgroundColor: '#2a1a1a', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e57373' },
  globalErrorText: { color: '#e57373', fontSize: 14 },
  input:           { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 4 },
  inputError:      { borderColor: '#e57373' },
  fieldError:      { color: '#e57373', fontSize: 12, marginBottom: 12, marginLeft: 4 },
  button:          { backgroundColor: '#4a90e2', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  buttonDisabled:  { opacity: 0.5 },
  buttonText:      { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link:            { color: '#888', textAlign: 'center' },
  linkBold:        { color: '#4a90e2', fontWeight: 'bold' },
});