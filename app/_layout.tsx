// app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Text, View } from 'react-native';

const client = new ApolloClient({
  uri: 'http://10.0.2.2:4000/',
  cache: new InMemoryCache(),
});

// Wrap children in AuthGate to delay rendering until auth is ready
function AuthGate({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();

  if (userId === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Initialising app...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AuthGate>
          <Slot />
        </AuthGate>
      </AuthProvider>
    </ApolloProvider>
  );
}
