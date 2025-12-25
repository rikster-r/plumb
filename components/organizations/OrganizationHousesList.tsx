import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '../GeistText';
import { useRouter } from 'expo-router';

interface HousesListProps {
  houses: House[];
}

const HousesList: React.FC<HousesListProps> = ({ houses }) => {
  const router = useRouter();

  return (
    <View>
      {houses.map((house) => (
        <TouchableOpacity
          key={house.id}
          style={styles.houseCard}
          onPress={() => router.push(`/houses/${house.id}`)}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color="#007AFF"
            style={styles.locationIcon}
          />

          <View style={styles.houseMain}>
            <View style={styles.houseHeader}>
              <View style={styles.houseInfo}>
                <GeistText weight={600} style={styles.houseAddress}>
                  {house.street}, {house.number}
                </GeistText>
                <GeistText weight={400} style={styles.houseCity}>
                  {house.city}
                </GeistText>
              </View>

              {house.commercial && (
                <View style={styles.commercialBadgeSmall}>
                  <GeistText weight={500} style={styles.commercialTextSmall}>
                    Коммерция
                  </GeistText>
                </View>
              )}
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  locationIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  houseCard: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  houseMain: {
    flex: 1,
    marginRight: 12,
  },
  houseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  houseInfo: {
    flex: 1,
    marginRight: 8,
  },
  houseAddress: {
    fontSize: 15,
    color: '#18181B',
    marginBottom: 2,
  },
  houseCity: {
    fontSize: 13,
    color: '#71717A',
  },
  commercialBadgeSmall: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  commercialTextSmall: {
    fontSize: 11,
    color: '#92400E',
  },
});

export default HousesList;
