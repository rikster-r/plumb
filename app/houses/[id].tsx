import BottomActionBar from '@/components/BottomActionBar';
import { GeistText } from '@/components/GeistText';
import ItemDetailsHeader from '@/components/ui/ItemDetailsHeader';
import { useUser } from '@/context/currentUser';
import { useHouseDetails } from '@/hooks/useHouseDetails';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { mutate as mutateGlobal } from 'swr';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const HouseDetailPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useUser();
  const {
    house,
    branch,
    organization,
    error,
    isLoading,
    mutate: mutateHouse,
  } = useHouseDetails(id);

  const openInMaps = () => {
    if (house?.lat && house?.long) {
      const url = `https://maps.google.com/?q=${house.lat},${house.long}`;
      Linking.openURL(url);
    }
  };

  const handleEdit = () => {
    router.push({ pathname: `/houses/[id]/edit`, params: { id } });
  };

  const handleDelete = () => {
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
              `${process.env.EXPO_PUBLIC_API_URL}/houses/${id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              },
            );

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Delete failed:', errorData);
              throw new Error('Failed to delete house');
            }

            await mutateGlobal(`${process.env.EXPO_PUBLIC_API_URL}/houses`); // refresh and wait for completion
            router.back();
          } catch (err) {
            Alert.alert('Ошибка', 'Не удалось удалить дом. Попробуйте снова.');
            console.error('Delete error:', err);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ItemDetailsHeader title="Детали дома" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#18181B" />
        </View>
      </View>
    );
  }

  if (error || !house) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ItemDetailsHeader title="Детали дома" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <GeistText weight={600} style={styles.errorText}>
            Не удалось загрузить данные
          </GeistText>
          <TouchableOpacity
            onPress={() => mutateHouse()}
            style={styles.retryButton}
          >
            <GeistText weight={600} style={styles.retryText}>
              Повторить попытку
            </GeistText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const facilities = [
    { key: 'barrier', label: 'Шлагбаум', value: house.barrier },
    { key: 'basement', label: 'Подвал', value: house.basement },
    { key: 'technical_floor', label: 'Техэтаж', value: house.technical_floor },
    { key: 'vru', label: 'ВРУ', value: house.vru },
    { key: 'dhw', label: 'ГВС', value: house.dhw },
    { key: 'cws', label: 'ХВС', value: house.cws },
    { key: 'heating_unit', label: 'Теплоузел', value: house.heating_unit },
    { key: 'pump', label: 'Насос', value: house.pump },
  ].filter((f) => f.value !== null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ItemDetailsHeader title="Детали дома" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Card */}
        <View style={styles.card}>
          <View style={styles.addressHeader}>
            <View style={styles.addressMain}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={22} color="#18181B" />
              </View>
              <View style={styles.addressTexts}>
                <GeistText weight={600} style={styles.addressStreet}>
                  {house.street}, {house.number}
                </GeistText>
                <GeistText weight={400} style={styles.addressCity}>
                  {house.city}
                  {house.region ? `, ${house.region}` : ''}
                </GeistText>
              </View>
            </View>
            {house.commercial && (
              <View style={styles.commercialBadge}>
                <GeistText weight={500} style={styles.commercialText}>
                  Коммерция
                </GeistText>
              </View>
            )}
          </View>

          {house.full_address && (
            <>
              <View style={styles.divider} />
              <GeistText weight={400} style={styles.fullAddress}>
                {house.full_address}
              </GeistText>
            </>
          )}

          {house?.lat && house?.long && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
                <Ionicons name="map-outline" size={18} color="#18181B" />
                <GeistText weight={500} style={styles.mapButtonText}>
                  Открыть на карте
                </GeistText>
                <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Building Stats */}
        <View style={styles.card}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Характеристики здания
          </GeistText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="business-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.statLabel}>
                Подъезд
              </GeistText>
              <GeistText weight={600} style={styles.statValue}>
                {house.count_entrance || '—'}
              </GeistText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="layers-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.statLabel}>
                Этаж
              </GeistText>
              <GeistText weight={600} style={styles.statValue}>
                {house.count_floor || '—'}
              </GeistText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="home-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.statLabel}>
                Квартира
              </GeistText>
              <GeistText weight={600} style={styles.statValue}>
                {house.count_apartment || '—'}
              </GeistText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="resize-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.statLabel}>
                Площадь
              </GeistText>
              <GeistText weight={600} style={styles.statValue}>
                {house.square
                  ? `${parseFloat(house.square).toFixed(0)} м²`
                  : '—'}
              </GeistText>
            </View>
          </View>
        </View>

        {/* Access Information */}
        {(house.intercom_code || house.key_location) && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Доступ и безопасность
            </GeistText>
            {house.intercom_code && (
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="keypad-outline" size={18} color="#52525B" />
                  <GeistText weight={400} style={styles.infoLabel}>
                    Код домофона
                  </GeistText>
                </View>
                <GeistText
                  weight={600}
                  style={[
                    styles.infoValue,
                    {
                      maxWidth: '55%',
                    },
                  ]}
                >
                  {house.intercom_code}
                </GeistText>
              </View>
            )}
            {house.key_location && (
              <View
                style={[
                  styles.infoRow,
                  house.intercom_code && styles.infoRowWithBorder,
                ]}
              >
                <View style={styles.infoLeft}>
                  <Ionicons name="key-outline" size={18} color="#52525B" />
                  <GeistText weight={400} style={styles.infoLabel}>
                    Расположение ключей
                  </GeistText>
                </View>
                <GeistText weight={600} style={styles.infoValue}>
                  {house.key_location}
                </GeistText>
              </View>
            )}
          </View>
        )}

        {/* Maintenance Schedule */}
        <View style={styles.card}>
          <GeistText weight={600} style={styles.sectionTitle}>
            График обслуживания
          </GeistText>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleLeft}>
              <Ionicons name="time-outline" size={18} color="#52525B" />
              <GeistText weight={400} style={styles.scheduleLabel}>
                Время работы
              </GeistText>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <GeistText weight={600} style={styles.infoValue}>
                С {house.exist_time}
              </GeistText>
              <GeistText weight={600} style={styles.infoValue}>
                По {house.arrival_time}
              </GeistText>
            </View>
          </View>

          {house.execpt_service_times &&
            house.execpt_service_times.length > 0 && (
              <>
                <View style={styles.divider} />
                <GeistText weight={600} style={styles.subsectionTitle}>
                  Исключения по дням недели
                </GeistText>
                <View style={styles.exceptionsGrid}>
                  {house.execpt_service_times.map((exception, index) => (
                    <View
                      key={exception.id || index}
                      style={styles.exceptionCard}
                    >
                      <View style={styles.exceptionHeader}>
                        <GeistText weight={600} style={styles.exceptionDay}>
                          {DAYS_OF_WEEK[exception.day - 1]}
                        </GeistText>
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color="#EF4444"
                        />
                      </View>
                      <GeistText weight={400} style={styles.exceptionTime}>
                        {exception.time_from} - {exception.time_to}
                      </GeistText>
                    </View>
                  ))}
                </View>
              </>
            )}
        </View>

        {/* Tariff */}
        {house.house_tariff && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Тарифная информация
            </GeistText>

            {organization && (
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="business-outline" size={18} color="#52525B" />
                  <GeistText weight={400} style={styles.infoLabel}>
                    Организация
                  </GeistText>
                </View>
                <GeistText weight={600} style={styles.infoValue}>
                  {organization.name}
                </GeistText>
              </View>
            )}

            {branch && (
              <View
                style={[
                  styles.infoRow,
                  organization && styles.infoRowWithBorder,
                ]}
              >
                <View style={styles.infoLeft}>
                  <Ionicons
                    name="git-branch-outline"
                    size={18}
                    color="#52525B"
                  />
                  <GeistText weight={400} style={styles.infoLabel}>
                    Филиал
                  </GeistText>
                </View>
                <GeistText weight={600} style={styles.infoValue}>
                  {branch.name}
                </GeistText>
              </View>
            )}

            <View
              style={[
                styles.infoRow,
                (organization || branch) && styles.infoRowWithBorder,
              ]}
            >
              <View style={styles.infoLeft}>
                <Ionicons name="calendar-outline" size={18} color="#52525B" />
                <GeistText weight={400} style={styles.infoLabel}>
                  Период
                </GeistText>
              </View>
              <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <GeistText weight={600} style={styles.infoValue}>
                  С {house.house_tariff.date_maintenance_from}
                </GeistText>
                <GeistText weight={600} style={styles.infoValue}>
                  По {house.house_tariff.date_maintenance_to}
                </GeistText>
              </View>
            </View>

            {house.house_tariff.rate && house.house_tariff.sum_rate && (
              <>
                <View style={styles.divider} />
                <View style={styles.tariffPriceContainer}>
                  <GeistText weight={500} style={styles.tariffPriceLabel}>
                    Стоимость обслуживания
                  </GeistText>
                  <GeistText weight={600} style={styles.tariffPrice}>
                    {parseFloat(house.house_tariff.sum_rate).toFixed(2)} ₸
                  </GeistText>
                </View>
              </>
            )}
          </View>
        )}

        {/* Facilities */}
        {facilities.length > 0 && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Оборудование и инфраструктура
            </GeistText>
            <View style={styles.facilitiesGrid}>
              {facilities.map((facility) => (
                <View
                  key={facility.key}
                  style={[
                    styles.facilityBadge,
                    facility.value && styles.facilityBadgeActive,
                  ]}
                >
                  <GeistText
                    weight={500}
                    style={[
                      styles.facilityText,
                      facility.value && styles.facilityTextActive,
                    ]}
                  >
                    {facility.label}
                  </GeistText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Note */}
        {house.note && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Примечание
            </GeistText>
            <GeistText weight={400} style={styles.noteText}>
              {house.note}
            </GeistText>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <BottomActionBar
        actions={[
          {
            label: 'Редактировать',
            icon: 'create-outline',
            onPress: handleEdit,
          },
          {
            label: 'Удалить',
            icon: 'trash-outline',
            onPress: handleDelete,
            destructive: true,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 130, // Extra padding for bottom bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    color: '#18181B',
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
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
    fontSize: 17,
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#18181B',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressMain: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    marginTop: 2,
  },
  addressTexts: {
    marginLeft: 10,
    flex: 1,
  },
  addressStreet: {
    fontSize: 17,
    color: '#18181B',
    lineHeight: 24,
  },
  addressCity: {
    fontSize: 14,
    color: '#52525B',
    lineHeight: 20,
    marginTop: 2,
  },
  commercialBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  commercialText: {
    fontSize: 13,
    color: '#92400E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginVertical: 14,
  },
  fullAddress: {
    fontSize: 14,
    color: '#27272A',
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  mapButtonText: {
    fontSize: 15,
    color: '#18181B',
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#18181B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FAFAFA',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F4F4F5',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    color: '#18181B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoRowWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 10,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#52525B',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#18181B',
    textAlign: 'right',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  scheduleItemWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 10,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  scheduleLabel: {
    fontSize: 14,
    color: '#52525B',
    marginLeft: 8,
  },
  scheduleValue: {
    fontSize: 14,
    color: '#18181B',
  },
  subsectionTitle: {
    fontSize: 15,
    color: '#18181B',
    marginBottom: 12,
    marginTop: 4,
  },
  exceptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exceptionCard: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    minWidth: 90,
  },
  exceptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exceptionDay: {
    fontSize: 13,
    color: '#991B1B',
  },
  exceptionTime: {
    fontSize: 12,
    color: '#DC2626',
  },
  tariffPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  tariffPriceLabel: {
    fontSize: 14,
    color: '#166534',
  },
  tariffPrice: {
    fontSize: 20,
    color: '#15803D',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FAFAFA',
    borderColor: '#E4E4E7',
    gap: 6,
  },
  facilityBadgeActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  facilityText: {
    fontSize: 13,
    color: '#A1A1AA',
  },
  facilityTextActive: {
    color: '#15803D',
  },
  noteText: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
  },
});

export default HouseDetailPage;
