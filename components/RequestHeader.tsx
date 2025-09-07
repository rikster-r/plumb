import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { router } from 'expo-router';

interface RequestHeaderProps {
  request: {
    id: string | number;
    status: string;
    paid?: boolean;
  };
  statusConfig: Record<
    string,
    {
      color: string;
      backgroundColor: string;
      borderColor: string;
      icon: keyof typeof Ionicons.glyphMap;
    }
  >;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({
  request,
  statusConfig,
}) => {
  const statusStyle = statusConfig[request.status as keyof typeof statusConfig];

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#09090B" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <GeistText weight={700} style={styles.headerTitle}>
          Заявка #{request.id}
        </GeistText>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.backgroundColor,
                borderColor: statusStyle.borderColor,
              },
            ]}
          >
            <Ionicons
              name={statusStyle.icon}
              size={14}
              color={statusStyle.color}
            />
            <GeistText
              weight={500}
              style={[styles.statusText, { color: statusStyle.color }]}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </GeistText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#09090B',
    lineHeight: 32,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  paidText: {
    fontSize: 12,
    color: '#0A7E5E',
  },
});

export default RequestHeader;
