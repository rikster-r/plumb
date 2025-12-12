import React, { useState, useMemo, useRef, useCallback } from 'react';
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
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import CreateHouseBottomSheet from '@/components/CreateHouseBottomSheet';
import HouseCard from '@/components/HouseCard';
import { PageHeader } from '@/components/PageHeader';

const HousesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Все');
  const { user, token } = useUser();
  const bottomSheetRef = useRef<BottomSheetModal>(
    null
  ) as React.RefObject<BottomSheetModal>;

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
    bottomSheetRef.current?.present();
  }, []);

  const handleCreateHouse = async (formData: any) => {
    if (!formData.city || !formData.street || !formData.number) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      const payload = {
        city: formData.city,
        street: formData.street,
        number: formData.number,
        count_entrance: formData.count_entrance
          ? parseInt(formData.count_entrance)
          : null,
        count_floor: formData.count_floor
          ? parseInt(formData.count_floor)
          : null,
        count_apartment: formData.count_apartment
          ? parseInt(formData.count_apartment)
          : null,
        square: formData.square || null,
        intercom_code: formData.intercom_code || null,
        key_location: formData.key_location || null,
        maintenance_from: formData.maintenance_from,
        maintenance_to: formData.maintenance_to,
        lat: formData.lat || null,
        long: formData.long || null,
        commercial: formData.commercial,
        note: formData.note || null,
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/houses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('Не удалось создать дом');

      await mutate();
    } catch (error: any) {
      alert(error.message || 'Ошибка при создании дома');
      throw error; // re-throw so bottom sheet knows it failed
    }
  };

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

      {/* Bottom Sheet for Creating House */}
      <CreateHouseBottomSheet
        bottomSheetRef={bottomSheetRef}
        onCreate={handleCreateHouse}
        onClose={() => bottomSheetRef.current?.dismiss()}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  formScroll: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C3C43',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  createButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HousesPage;
