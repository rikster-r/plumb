// components/HouseCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from './GeistText'; // Adjust path as needed

type HouseCardProps = {
  item: House;
  onPress?: () => void;
};

const HouseCard: React.FC<HouseCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.houseCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Header with address */}
      <View style={styles.cardHeader}>
        <View style={styles.addressContainer}>
          <Ionicons
            name="location"
            size={20}
            color="#007AFF"
            style={styles.locationIcon}
          />
          <View style={styles.addressTextContainer}>
            <GeistText weight={600} style={styles.streetText}>
              {item.street}, {item.number}
            </GeistText>
            <GeistText weight={400} style={styles.cityText}>
              {item.city}
            </GeistText>
          </View>
        </View>
        {item.commercial && (
          <View style={styles.commercialBadge}>
            <GeistText weight={600} style={styles.commercialText}>
              Коммерция
            </GeistText>
          </View>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="business-outline" size={18} color="#8E8E93" />
          <GeistText weight={500} style={styles.statLabel}>
            Подъезды
          </GeistText>
          <GeistText weight={600} style={styles.statValue}>
            {item.count_entrance || '—'}
          </GeistText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="layers-outline" size={18} color="#8E8E93" />
          <GeistText weight={500} style={styles.statLabel}>
            Этажи
          </GeistText>
          <GeistText weight={600} style={styles.statValue}>
            {item.count_floor || '—'}
          </GeistText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="home-outline" size={18} color="#8E8E93" />
          <GeistText weight={500} style={styles.statLabel}>
            Квартиры
          </GeistText>
          <GeistText weight={600} style={styles.statValue}>
            {item.count_apartment || '—'}
          </GeistText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="resize-outline" size={18} color="#8E8E93" />
          <GeistText weight={500} style={styles.statLabel}>
            Площадь
          </GeistText>
          <GeistText weight={600} style={styles.statValue}>
            {item.square ? `${parseFloat(item.square).toFixed(0)} м²` : '—'}
          </GeistText>
        </View>
      </View>

      {/* Additional Info */}
      <View style={styles.infoSection}>
        {item.intercom_code && (
          <View style={styles.infoRow}>
            <Ionicons name="keypad-outline" size={16} color="#8E8E93" />
            <GeistText weight={400} style={styles.infoText}>
              Домофон: {item.intercom_code}
            </GeistText>
          </View>
        )}
        {item.maintenance_from && item.maintenance_to && (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#8E8E93" />
            <GeistText weight={400} style={styles.infoText}>
              Обслуживание: {item.maintenance_from} - {item.maintenance_to}
            </GeistText>
          </View>
        )}
        {item.key_location && (
          <View style={styles.infoRow}>
            <Ionicons name="key-outline" size={16} color="#8E8E93" />
            <GeistText weight={400} style={styles.infoText}>
              Ключи: {item.key_location}
            </GeistText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    color: '#000000',
    marginBottom: 2,
  },
  cityText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  commercialBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  commercialText: {
    fontSize: 12,
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
  },
  statValue: {
    fontSize: 16,
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
  },
});

export default HouseCard;