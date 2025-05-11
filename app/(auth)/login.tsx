import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();
  const { setUserId } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await login({ variables: { email, password } });

      if (res.data.login) {
        setUserId(res.data.login);
        router.replace('/');
      } else {
        Alert.alert('Login failed', 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'Something went wrong during login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={loading ? 'Logging in...' : 'Log In'}
        onPress={handleLogin}
        disabled={loading || !email || !password}
      />

      <TouchableOpacity onPress={() => router.replace('/signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
    color: 'blue',
  },
});
