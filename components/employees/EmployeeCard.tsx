import { GeistText } from '@/components/GeistText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '@/context/currentUser';
import { KeyedMutator } from 'swr';

type EmployeeCardProps = {
  item: Employee;
  mutateEmployees: KeyedMutator<Employee[]>;
};

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  item,
  mutateEmployees,
}) => {
  const { token } = useUser();

  const handleDeletePress = () => {
    Alert.alert(
      'Удалить сотрудника',
      'Вы уверены, что хотите удалить этого сотрудника?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/employees/${item.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (!res.ok) {
                throw new Error('Delete failed');
              }

              await mutateEmployees();
            } catch (e) {
              Alert.alert(
                'Ошибка',
                'Не удалось удалить сотрудника. Попробуйте снова.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.leftHeader}>
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

        {/* Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeletePress();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Details */}
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
};

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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
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
