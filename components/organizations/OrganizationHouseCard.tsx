import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '../GeistText';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/currentUser';
import { KeyedMutator } from 'swr';

type HouseCardProps = {
  item: House;
  mutateHouses: KeyedMutator<number[]>;
};

const HouseCard: React.FC<HouseCardProps> = ({ item, mutateHouses }) => {
  const router = useRouter();
  const { token } = useUser();

  const handleDeletePress = () => {
    Alert.alert('Удалить дом', 'Вы уверены, что хотите удалить этот дом?', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/houses/${item.id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Delete failed:', errorData);
              throw new Error('Failed to delete house');
            }

            await mutateHouses();
            router.back();
          } catch (err) {
            Alert.alert('Ошибка', 'Не удалось удалить дом. Попробуйте снова.');
            console.error('Delete error:', err);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.houseCard}
      activeOpacity={0.7}
      onPress={() =>
        router.push({ pathname: '/houses/[id]', params: { id: item.id } })
      }
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

        {/* Right column */}
        <View style={styles.rightColumn}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                router.push({
                  pathname: '/houses/[id]/edit',
                  params: { id: item.id },
                });
              }}
            >
              <Ionicons name="pencil" size={16} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDeletePress();
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          {item.commercial && (
            <View style={styles.commercialBadge}>
              <GeistText weight={600} style={styles.commercialText}>
                Коммерция
              </GeistText>
            </View>
          )}
        </View>
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
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  commercialBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
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
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  commercialText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default HouseCard;
