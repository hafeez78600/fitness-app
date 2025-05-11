import React, { useState } from 'react';
import {View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql, useQuery } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import FoodListLog from '@/components/FoodListLog';
import CalorieList from '@/components/CalorieList';

const GET_FOOD_LOGS = gql`
  query GetFoodLogs($date: String!, $user_id: String!) {
    foodLogsForDate(date: $date, user_id: $user_id) {
      id
      food_id
      user_id
      label
      kcal
      created_at
    }
  }
`;

export default function HomeScreen() {
  const { userId } = useAuth();
  const [goal, setGoal] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('dailyCalorieGoal').then((val) => {
        if (val) setGoal(Number(val));
      });
    }, [])
  );

  const formattedDate = selectedDate.toISOString().split('T')[0];

  const { data, loading, error } = useQuery(GET_FOOD_LOGS, {
    variables: { date: formattedDate, user_id: userId },
    pollInterval: 3000,
    skip: !userId,
  });

  const consumedCalories =
    data?.foodLogsForDate?.reduce((sum: number, item: { kcal: number }) => sum + item.kcal, 0) ?? 0;

  const remainingCalories = goal !== null ? goal - consumedCalories : null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Dashboard</Text>
        <Link href="/search" asChild>
          <Button title="Add Food" />
        </Link>
      </View>

      <View style={styles.calorieSection}>
        <Button
          title={`Change Date (${formattedDate})`}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
        <Text style={styles.subtitle}>Calories</Text>
        {goal !== null && (
          <Text>
            {goal} - {consumedCalories} = {remainingCalories}
          </Text>
        )}
      </View>

      <View style={styles.logContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text>Failed to fetch data</Text>
        ) : (
          <FlatList
            data={data?.foodLogsForDate}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FoodListLog item={item} />}
            contentContainerStyle={{ gap: 5 }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.subtitle}>7-Day Calorie History</Text>
        <CalorieList goal={goal ?? 2000} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'dimgray',
  },
  calorieSection: {
    gap: 5,
    marginVertical: 10,
  },
  logContainer: {
    flex: 1,
  },
  footer: {
    marginTop: 10,
    paddingBottom: 10,
  },
});
