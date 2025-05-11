import { StyleSheet, View, Text, Button } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';

const DELETE_LOG = gql`
  mutation DeleteFoodLog($id: ID!, $user_id: String!) {
    deleteFoodLog(id: $id, user_id: $user_id)
  }
`;

const FoodListLog = ({item,}: {item: { id: string; label: string; kcal: number };}) => {
  const { userId } = useAuth();

  const [deleteFoodLog] = useMutation(DELETE_LOG, {
    variables: { id: item.id, user_id: userId },
    refetchQueries: ['GetFoodLogs', 'CaloriesPerDay'],
  });

  const handleDelete = () => {
    deleteFoodLog().catch((err) => console.error('Delete error:', err));
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.detail}>{item.kcal} cal</Text>
      </View>
      <Button title="Delete" color="red" onPress={handleDelete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6f8',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detail: {
    color: 'dimgray',
  },
});

export default FoodListLog;
