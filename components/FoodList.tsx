import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const ADD_FOOD_LOG = gql`
  mutation AddFoodLog($user_id: String!, $label: String!, $cal: Int!, $brand: String!) {
    addFoodLog(user_id: $user_id, label: $label, cal: $cal, brand: $brand)
  }
`;

const FoodList = ({ item }: { item: { label: string; cal: number; brand: string } } ) => {
  const { userId } = useAuth();
  const [quantity, setQuantity] = useState('1');
  const [addFoodLog] = useMutation(ADD_FOOD_LOG);

  const calPer100g = item.cal || 0;
  const totalCal = Math.round((calPer100g / 100) * (parseFloat(quantity) || 0));

  const handleAdd = async () => {
    try {
      await addFoodLog({
        variables: {
          user_id: userId,
          label: item.label,
          cal: totalCal,
          brand: item.brand,
        },
      });
    } catch (err) {
      console.error('Error logging food:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.subtext}>{item.cal} cal per 100g • {item.brand}</Text>
        <View style={styles.inputRow}>
          <TextInput
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            style={styles.qtyInput}
          />
          <Text style={styles.unit}>gram</Text>
          <Text style={styles.total}>{totalCal} cal</Text>
        </View>
      </View>
      <Feather name="plus-circle" size={24} color="black" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6f8',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtext: {
    color: 'dimgray',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    width: 40,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: 'center',
  },
  unit: {
    color: 'dimgray',
  },
  total: {
    fontWeight: 'bold',
  },
});

export default FoodList;
