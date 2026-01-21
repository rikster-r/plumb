import { GeistText } from '@/components/GeistText';
import HouseCard from '@/components/houses/HouseCard';
import { PageHeader } from '@/components/PageHeader';
import { StatusTabs } from '@/components/StatusTabs';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import { Ionicons } from '@expo/vector-icons';
import useSWRNative from '@nandorojo/swr-react-native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
    ([url, token]) => fetcherWithToken(url, token),
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
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (h) =>
          (h.full_address?.toLowerCase().includes(query) ?? false) ||
          (h.street?.toLowerCase().includes(query) ?? false) ||
          (h.number?.toLowerCase().includes(query) ?? false),
      );
    }

    return filtered;
  }, [searchQuery, selectedCity, houses]);

  const handleCreateRedirect = useCallback(() => {
    router.push('/houses/create');
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <PageHeader title="Дома" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#18181B" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <PageHeader title="Дома" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <GeistText weight={600} style={styles.errorText}>
            Не удалось загрузить дома
          </GeistText>
          <TouchableOpacity onPress={() => mutate()} style={styles.retryButton}>
            <GeistText weight={600} style={styles.retryText}>
              Повторить попытку
            </GeistText>
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
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#71717A"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по адресу..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A1A1AA"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#71717A" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateRedirect}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* City Filter Tabs */}
      <StatusTabs
        tabs={cities}
        selected={selectedCity}
        onSelect={setSelectedCity}
      />

      {/* Houses List */}
      <FlatList
        data={filteredHouses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HouseCard
            item={item}
            onPress={() =>
              router.push({
                pathname: `/houses/[id]`,
                params: { id: item.id.toString() },
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => mutate()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={64} color="#D4D4D8" />
            <GeistText weight={600} style={styles.emptyText}>
              Дома не найдены
            </GeistText>
            <GeistText weight={400} style={styles.emptySubtext}>
              Попробуйте изменить запрос
            </GeistText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    borderRadius: 100,
    height: 44,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#18181B',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: '100%',
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  tabActive: {
    backgroundColor: '#1F5EDB',
    borderColor: '#D0E0FF',
  },
  tabText: {
    fontSize: 14,
    color: '#52525B',
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
    fontSize: 17,
    color: '#EF4444',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1F5EDB',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#18181B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 4,
  },
});

export default HousesPage;
