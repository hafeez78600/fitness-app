import React, { useState } from 'react';
import {View,Text,TextInput,Button,Alert,StyleSheet,TouchableOpacity,} from 'react-native';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { loading }] = useMutation(REGISTER_MUTATION);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await register({ variables: { email, password } });
      if (res.data.register) {
        Alert.alert('Success', 'Account created. You can now log in.');
        router.replace('/login');
      } else {
        Alert.alert('Registration failed', 'Email might already be in use.');
      }
    } catch (err) {
      console.error('Register error:', err);
      Alert.alert('Error', 'Something went wrong during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        importantForAutofill="no"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        importantForAutofill="no"
      />
      <Button
        title={loading ? 'Registering...' : 'Register'}
        onPress={handleRegister}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
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
