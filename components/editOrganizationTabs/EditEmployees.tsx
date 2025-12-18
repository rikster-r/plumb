import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrganizationDetails } from '@/hooks/useOrganizationDetails';
import { GeistText } from '@/components/GeistText';
import { useLocalSearchParams } from 'expo-router';

interface Employee {
  id: number;
  organization_id: number;
  full_name: string;
  position: string;
  phone: string;
  note: string | null;
}

const EmployeeCard = ({ item }: { item: Employee }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Ionicons name="person" size={20} color="#007AFF" />
      </View>
      <View style={styles.cardContent}>
        <GeistText weight={600} style={styles.employeeName}>
          {item.full_name}
        </GeistText>
        <GeistText weight={400} style={styles.employeePosition}>
          {item.position}
        </GeistText>
      </View>
    </View>

    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <Ionicons name="call-outline" size={16} color="#71717A" />
        <GeistText weight={400} style={styles.detailText}>
          {item.phone}
        </GeistText>
      </View>
      {item.note && (
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={16} color="#71717A" />
          <GeistText weight={400} style={styles.detailText}>
            {item.note}
          </GeistText>
        </View>
      )}
    </View>
  </View>
);

export const EditOrgEmployees = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const { employees, isLoading } = useOrganizationDetails(id);

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return employees.filter(
        (employee: Employee) =>
          employee.full_name.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query) ||
          employee.phone.toLowerCase().includes(query)
      );
    }

    return employees;
  }, [searchQuery, employees]);

  const handleAddEmployee = () => {
    // Add employee functionality will be implemented later
    console.log('Add employee clicked');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#18181B" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            placeholder="Поиск"
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
          onPress={handleAddEmployee}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Employees List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EmployeeCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#D4D4D8" />
            <GeistText weight={600} style={styles.emptyText}>
              Отсутствуют данные
            </GeistText>
            <GeistText weight={400} style={styles.emptySubtext}>
              Нажмите +, чтобы добавить сотрудника
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 22,
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
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    color: '#18181B',
    marginBottom: 2,
  },
  employeePosition: {
    fontSize: 14,
    color: '#71717A',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#52525B',
    flex: 1,
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
