import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

interface House {
  id: number;
  city: string;
  street: string;
  number: string;
  full_address: string;
  region: string | null;
  area: string | null;
  complex: string | null;
  frame: string | null;
  building: string | null;
  count_entrance: number | null;
  count_floor: number | null;
  count_apartment: number | null;
  square: string;
  intercom_code: string | null;
  key_location: string | null;
  maintenance_from: string;
  maintenance_to: string;
  lat: string;
  long: string;
  organization_id: number | null;
  address_type_id: number;
  commercial: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const HousesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Все');
  const { user, token } = useUser();

  const {
    data: houses,
    error,
    isLoading,
    mutate,
  } = useSWRNative<House[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/houses`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // Get unique cities
  const cities = useMemo(() => {
    if (!houses) return ['Все'];
    const citySet = new Set(houses.map(h => h.city));
    return ['Все', ...Array.from(citySet)];
  }, [houses]);

  // Filter houses
  const filteredHouses = useMemo(() => {
    if (!houses) return [];
    let filtered = houses;
    
    if (selectedCity !== 'Все') {
      filtered = filtered.filter(h => h.city === selectedCity);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.full_address.toLowerCase().includes(query) ||
        h.street.toLowerCase().includes(query) ||
        h.number.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCity, houses]);

  const renderHouseCard = ({ item }: { item: House }) => (
    <TouchableOpacity style={styles.houseCard} activeOpacity={0.7}>
      {/* Header with address */}
      <View style={styles.cardHeader}>
        <View style={styles.addressContainer}>
          <Ionicons name="location" size={20} color="#007AFF" style={styles.locationIcon} />
          <View style={styles.addressTextContainer}>
            <Text style={styles.streetText}>{item.street}, {item.number}</Text>
            <Text style={styles.cityText}>{item.city}</Text>
          </View>
        </View>
        {item.commercial && (
          <View style={styles.commercialBadge}>
            <Text style={styles.commercialText}>Коммерция</Text>
          </View>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="business-outline" size={18} color="#8E8E93" />
          <Text style={styles.statLabel}>Подъезды</Text>
          <Text style={styles.statValue}>{item.count_entrance || '—'}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Ionicons name="layers-outline" size={18} color="#8E8E93" />
          <Text style={styles.statLabel}>Этажи</Text>
          <Text style={styles.statValue}>{item.count_floor || '—'}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Ionicons name="home-outline" size={18} color="#8E8E93" />
          <Text style={styles.statLabel}>Квартиры</Text>
          <Text style={styles.statValue}>{item.count_apartment || '—'}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Ionicons name="resize-outline" size={18} color="#8E8E93" />
          <Text style={styles.statLabel}>Площадь</Text>
          <Text style={styles.statValue}>
            {item.square ? `${parseFloat(item.square).toFixed(0)} м²` : '—'}
          </Text>
        </View>
      </View>

      {/* Additional Info */}
      <View style={styles.infoSection}>
        {item.intercom_code && (
          <View style={styles.infoRow}>
            <Ionicons name="keypad-outline" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>Домофон: {item.intercom_code}</Text>
          </View>
        )}
        
        {item.maintenance_from && item.maintenance_to && (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>
              Обслуживание: {item.maintenance_from} - {item.maintenance_to}
            </Text>
          </View>
        )}

        {item.key_location && (
          <View style={styles.infoRow}>
            <Ionicons name="key-outline" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>Ключи: {item.key_location}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Дома</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Дома</Text>
        </View>
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
      <View style={styles.header}>
        <Text style={styles.title}>Дома</Text>
        <Text style={styles.subtitle}>
          {filteredHouses.length} из {houses?.length || 0}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по адресу..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
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
              style={[
                styles.tab,
                selectedCity === item && styles.tabActive
              ]}
              onPress={() => setSelectedCity(item)}
            >
              <Text style={[
                styles.tabText,
                selectedCity === item && styles.tabTextActive
              ]}>
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
        renderItem={renderHouseCard}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
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
  houseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  locationIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  addressTextContainer: {
    flex: 1,
  },
  streetText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  cityText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  commercialBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  commercialText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  statLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  infoSection: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#3C3C43',
    marginLeft: 8,
    fontWeight: '400',
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