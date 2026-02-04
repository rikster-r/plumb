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
  nextStatusLabel: string | null;
  onStatusChange?: () => void;
  isActionBlocked?: boolean;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({
  request,
  nextStatusLabel,
  onStatusChange,
  isActionBlocked,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#09090B" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <GeistText weight={700} style={styles.headerTitle}>
          Заявка #{request.id}
        </GeistText>
        {/* <View style={styles.badgeRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: currentStatusConfig.backgroundColor,
                borderColor: currentStatusConfig.borderColor,
              },
            ]}
          >
            <Ionicons
              name={currentStatusConfig.icon}
              size={14}
              color={currentStatusConfig.color}
            />
            <GeistText
              weight={500}
              style={[styles.statusText, { color: currentStatusConfig.color }]}
            >
              {currentStatusConfig.label}
            </GeistText>
          </View>
        </View> */}

        {!isActionBlocked && (
          <TouchableOpacity
            onPress={onStatusChange}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <GeistText weight={600} style={[styles.actionButtonText]}>
              {nextStatusLabel}
            </GeistText>
          </TouchableOpacity>
        )}
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
  headerTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#09090B',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#1F5EDB',
  },
  backButton: {
    marginRight: 6,
    padding: 6,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RequestHeader;
