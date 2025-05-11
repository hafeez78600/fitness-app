import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const { setUserId } = useAuth();
  const router = useRouter();

  const [goal, setGoal] = useState(2000);
  const [input, setInput] = useState('2000');

  useEffect(() => {
    AsyncStorage.getItem('dailyCalorieGoal').then((val) => {
      if (val) {
        setGoal(Number(val));
        setInput(val);
      }
    });
  }, []);

  const handleSaveGoal = async () => {
    const num = Number(input);
    if (!isNaN(num) && num > 0) {
      await AsyncStorage.setItem('dailyCalorieGoal', num.toString());
      setGoal(num);
      Alert.alert('Updated', `Calorie goal set to ${num} kcal`);
    } else {
      Alert.alert('Invalid input', 'Please enter a valid number.');
    }
  };

  const handleLogout = () => {
    setUserId(null);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Daily Calorie Goal (kcal)</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Save Goal" onPress={handleSaveGoal} />
      </View>

      <View style={styles.section}>
        <Button title="Log Out" color="black" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    gap: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: 'dimgray',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
});
