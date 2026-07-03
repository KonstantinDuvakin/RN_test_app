import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLoginViewModel } from '../hooks/useLoginViewModel';

export function LoginScreen({ navigation }: any) {
  const vm = useLoginViewModel(() => navigation.replace('Tasks'));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        style={styles.input}
        placeholder="Email (test@test.com)"
        autoCapitalize="none"
        keyboardType="email-address"
        value={vm.email}
        onChangeText={vm.setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль (123456)"
        secureTextEntry
        value={vm.password}
        onChangeText={vm.setPassword}
      />
      <TouchableOpacity
        style={[styles.button, !vm.canSubmit && styles.buttonDisabled]}
        onPress={vm.submit}
        disabled={!vm.canSubmit || vm.isPending}
      >
        {vm.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Войти</Text>
        )}
      </TouchableOpacity>
      {vm.errorMessage && <Text style={styles.error}>{vm.errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E5C8A',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#d33', textAlign: 'center', marginTop: 8 },
});
