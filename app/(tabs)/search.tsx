import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { gql, useLazyQuery } from '@apollo/client';
import FoodList from '@/components/FoodList';

const SEARCH_FOOD = gql`
  query SearchFood($query: String!) {
    searchFood(query: $query) {
      label
      cal
      brand
    }
  }
`;

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const [runSearch, { data, loading, error }] = useLazyQuery(SEARCH_FOOD);
  const items = data?.searchFood || [];

  const performSearch = () => {
    runSearch({ variables: { query: search } });
    setHasSearched(true);
    setSearch('');
  };

  if (error) return <Text>Failed to search</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search a food"
          placeholderTextColor="gray"
          style={styles.input}
        />
      </View>

      {search && <Button title="Search" onPress={performSearch} />}
      {loading && <ActivityIndicator />}

      {!hasSearched ? (
        <View style={styles.emptyState}>
          <Feather name="search" size={36} color="gray" />
          <Text style={styles.emptyTitle}>Start Searching</Text>
          <Text style={styles.emptySubtitle}>
            Type a food name above to find the calories.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }) => <FoodList item={item} />}
          keyExtractor={(item, index) => `${item.label}-${index}`}
          contentContainerStyle={{ gap: 5 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
