import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';
import HouseCard from '@/components/HouseCard';
import { PageHeader } from '@/components/PageHeader';
import { useRouter } from 'expo-router';

const HousesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Все');
  const { user, token } = useUser();
  const router = useRouter();
  const {
    data: houses,
    error,
    isLoading,
    mutate,
  } = useSWRNative<House[]>(
    user && token ? [`${process.env.EXPO_PUBLIC_API_URL}/houses`, token] : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // Get unique cities
  const cities = useMemo(() => {
    if (!houses) return ['Все'];
    const citySet = new Set(houses.map((h) => h.city));
    return ['Все', ...Array.from(citySet)];
  }, [houses]);

  // Filter houses
  const filteredHouses = useMemo(() => {
    if (!houses) return [];
    let filtered = houses;

    if (selectedCity !== 'Все') {
      filtered = filtered.filter((h) => h.city === selectedCity);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          (h.full_address?.toLowerCase().includes(query) ?? false) ||
          (h.street?.toLowerCase().includes(query) ?? false) ||
          (h.number?.toLowerCase().includes(query) ?? false)
      );
    }

    return filtered;
  }, [searchQuery, selectedCity, houses]);

  const handleOpenBottomSheet = useCallback(() => {
    router.push('/houses/create');
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <PageHeader title="Дома" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <PageHeader title="Дома" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || 'Не удалось загрузить дома'}
          </Text>
          <TouchableOpacity onPress={() => mutate()}>
            <Text style={styles.retryText}>Повторить попытку</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <PageHeader
        title="Дома"
        subtitle={`${filteredHouses.length} из ${houses?.length || 0}`}
      />

      {/* Search Bar */}
      <View style={styles.searchRowContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по адресу..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleOpenBottomSheet}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* City Filter Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          data={cities}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, selectedCity === item && styles.tabActive]}
              onPress={() => setSelectedCity(item)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCity === item && styles.tabTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Houses List */}
      <FlatList
        data={filteredHouses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HouseCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => mutate()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={64} color="#D1D1D6" />
            <Text style={styles.emptyText}>Дома не найдены</Text>
            <Text style={styles.emptySubtext}>Попробуйте изменить фильтры</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchRowContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
    flexGrow: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#F2F2F7',
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3C3C43',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3C3C43',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
});

export default HousesPage;
