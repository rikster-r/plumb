// components/OrganizationCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '../GeistText';

interface Organization {
  id: number;
  name: string;
}

type OrganizationCardProps = {
  item: Organization;
  onPress?: () => void;
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.organizationCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="briefcase" size={24} color="#007AFF" />
        </View>
        
        <View style={styles.infoContainer}>
          <GeistText weight={600} style={styles.nameText}>
            {item.name}
          </GeistText>
          <GeistText weight={400} style={styles.idText}>
            ID: {item.id}
          </GeistText>
        </View>

        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  organizationCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 17,
    color: '#000000',
    marginBottom: 4,
  },
  idText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  chevronContainer: {
    marginLeft: 8,
  },
});

export default OrganizationCard;