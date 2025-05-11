import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function BmiCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [bmiInfo, setBmiInfo] = useState('');
  const [error, setError] = useState('');

  const calculateBMI = () => {
    setError('');
    const heightM = parseFloat(height) / 100;
    const weightKg = parseFloat(weight);
    const ageVal = parseFloat(age);

    if (!age || !height || !weight) {
      setError('Please fill in all fields.');
      setBmi(null);
      setMessage('');
      setBmiInfo('');
      return;
    }

    if (isNaN(heightM) || isNaN(weightKg) || isNaN(ageVal)) {
      setError('All fields must be valid numbers.');
      setBmi(null);
      setMessage('');
      setBmiInfo('');
      return;
    }

    if (heightM <= 0 || weightKg <= 0 || ageVal <= 0) {
      setError('All values must be greater than zero.');
      setBmi(null);
      setMessage('');
      setBmiInfo('');
      return;
    }

    const bmiVal = weightKg / (heightM * heightM);
    setBmi(bmiVal);

    if (bmiVal < 18.5) {
      setMessage('Underweight');
      setBmiInfo('Being underweight may indicate nutritional deficiencies. Consider speaking with a healthcare provider.');
    } else if (bmiVal < 25) {
      setMessage('Normal weight');
      setBmiInfo('Your BMI is within the healthy range. Keep up with a balanced diet and regular activity.');
    } else if (bmiVal < 30) {
      setMessage('Overweight');
      setBmiInfo('A BMI in this range may increase the risk of heart disease and other health issues.');
    } else {
      setMessage('Obese');
      setBmiInfo('Obesity is associated with increased risk of diabetes, heart disease, and other conditions. Consult a healthcare provider for guidance.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      <View style={styles.genderToggle}>
        <TouchableOpacity onPress={() => setGender('male')}>
          <Text style={[styles.genderText, gender === 'male' && styles.selectedGender]}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender('female')}>
          <Text style={[styles.genderText, gender === 'female' && styles.selectedGender]}>Female</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>CALCULATE BMI</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {bmi !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your BMI: {bmi.toFixed(1)}</Text>
          <Text style={styles.messageText}>{message}</Text>
          <Text style={styles.infoText}>{bmiInfo}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  genderToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genderText: {
    fontSize: 16,
    marginHorizontal: 15,
    color: 'grey',
  },
  selectedGender: {
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 12,
  },
});
