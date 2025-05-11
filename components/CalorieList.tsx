import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';

const CALORIES_PER_DAY = gql`
  query CaloriesPerDay($user_id: String!, $days: Int!) {
    caloriesPerDay(user_id: $user_id, days: $days) {
      date
      total
    }
  }
`;

type Props = {
  goal: number;
};

export default function CalorieList({ goal }: Props) {
  const { userId } = useAuth();

  const { data, loading, error } = useQuery(CALORIES_PER_DAY, {
    variables: { user_id: userId, days: 7 },
    skip: !userId,
  });

  if (!userId) return <Text>User not logged in</Text>;
  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data || data.caloriesPerDay.length === 0) return <Text>No entries for past 7 days</Text>;

  return (
    <View style={styles.container}>
      {data.caloriesPerDay.map(({ date, total }: { date: string; total: number }) => {
        const status = total > goal ? 'Over' : 'Under';
        const colour = total > goal ? 'red' : 'green';
        return (
          <View key={date} style={styles.row}>
            <Text style={styles.date}>{date}</Text>
            <Text style={[styles.total, { color: colour }]}>
              {total} kcal ({status} goal)
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
  },
  date: {
    fontWeight: '500',
    color: '#333',
  },
  total: {
    fontWeight: 'bold',
  },
});
