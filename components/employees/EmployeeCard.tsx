import { GeistText } from '@/components/GeistText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export const EmployeeCard = ({ item }: { item: Employee }) => (
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
        <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
          <Ionicons name="document-text-outline" size={16} color="#71717A" />
          <GeistText weight={400} style={styles.detailText}>
            {item.note}
          </GeistText>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E4E4E7',
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
});
