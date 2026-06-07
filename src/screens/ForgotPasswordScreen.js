import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { resetUserPassword } from '../firebase/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu email.');
      return;
    }
    try {
      setLoading(true);
      await resetUserPassword(email.trim());
      Alert.alert('Email enviado', 'Verifique sua caixa de entrada para redefinir a senha.', [
        { text: 'Voltar', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Informe seu email e enviaremos as instruções de recuperação.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

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
  container:      { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', padding: 24 },
  title:          { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle:       { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  input: {
    backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 10,
    padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 16,
  },
  button:         { backgroundColor: '#4a90e2', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  buttonDisabled: { opacity: 0.5 },
  buttonText:     { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link:           { color: '#555', textAlign: 'center', fontSize: 14 },
});