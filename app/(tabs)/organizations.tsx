import CreateOrganizationBottomSheet from '@/components/organizations/CreateOrganizationBottomSheet';
import OrganizationCard from '@/components/organizations/OrganizationCard';
import { PageHeader } from '@/components/PageHeader';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import { Ionicons } from '@expo/vector-icons';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import useSWRNative from '@nandorojo/swr-react-native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const OrganizationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, token } = useUser();
  const bottomSheetRef = useRef<BottomSheetModal>(
    null
  ) as React.RefObject<BottomSheetModal>;
  const router = useRouter();

  const {
    data: organizations,
    error,
    isLoading,
    mutate,
  } = useSWRNative<Organization[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/organizations`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    if (!organizations) return [];

    if (!searchQuery.trim()) return organizations;

    const query = searchQuery.toLowerCase();
    return organizations.filter((org) =>
      org.name.toLowerCase().includes(query)
    );
  }, [searchQuery, organizations]);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCreateOrganization = async (formData: any) => {
    if (!formData.name) {
      alert('Введите название организации');
      return;
    }

    try {
      const payload = {
        name: formData.name,
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/organizations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('Не удалось создать организацию');

      await mutate();
    } catch (error: any) {
      alert(error.message || 'Ошибка при создании организации');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <PageHeader title="Организации" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <PageHeader title="Организации" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || 'Не удалось загрузить организации'}
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
        title="Организации"
        subtitle={`${filteredOrganizations.length} из ${organizations?.length || 0}`}
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
          onPress={handleOpenBottomSheet}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Organizations List */}
      <FlatList
        data={filteredOrganizations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrganizationCard
            item={item}
            onPress={() =>
              router.push({
                pathname: `/organizations/[id]`,
                params: { id: item.id },
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
            <Ionicons name="briefcase-outline" size={64} color="#D1D1D6" />
            <Text style={styles.emptyText}>Организации не найдены</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Попробуйте изменить запрос'
                : 'Добавьте первую организацию'}
            </Text>
          </View>
        }
      />

      {/* Bottom Sheet for Creating Organization */}
      {bottomSheetRef && (
        <CreateOrganizationBottomSheet
          bottomSheetRef={bottomSheetRef}
          onCreate={handleCreateOrganization}
          onClose={() => bottomSheetRef.current?.dismiss()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
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

export default OrganizationsPage;
