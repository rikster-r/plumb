import BottomActionBar from '@/components/BottomActionBar';
import { GeistText } from '@/components/GeistText';
import { useUser } from '@/context/currentUser';
import { useOrganizationDetails } from '@/hooks/useOrganizationDetails';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { mutate as mutateGlobal } from 'swr';

const OrganizationDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useUser();

  const {
    organization,
    branch,
    houses,
    employees,
    isLoading,
    error,
    mutateOrganization,
  } = useOrganizationDetails(id);

  const callPhone = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page
    // router.push(`/organization/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить организацию',
      'Вы уверены, что хотите удалить эту организацию?',
      [
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
                `${process.env.EXPO_PUBLIC_API_URL}/organizations/${id}`,
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
                throw new Error('Failed to delete organization');
              }

              await mutateGlobal(
                `${process.env.EXPO_PUBLIC_API_URL}/organizations`
              );
              router.back();
            } catch (err) {
              Alert.alert(
                'Ошибка',
                'Не удалось удалить организацию. Попробуйте снова.'
              );
              console.error('Delete error:', err);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#18181B" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#18181B" />
        </View>
      </View>
    );
  }

  if (error || !organization) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#18181B" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <GeistText weight={600} style={styles.errorText}>
            Не удалось загрузить данные
          </GeistText>
          <TouchableOpacity
            onPress={() => mutateOrganization()}
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#18181B" />
        </TouchableOpacity>
        <GeistText weight={600} style={styles.headerTitle}>
          Детали организации
        </GeistText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Organization Name Card */}
        <View style={styles.card}>
          <View style={styles.orgHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="business" size={24} color="#18181B" />
            </View>
            <View style={styles.orgTexts}>
              <GeistText weight={600} style={styles.orgName}>
                {organization.name}
              </GeistText>
              {organization.full_name && (
                <GeistText weight={400} style={styles.orgFullName}>
                  {organization.full_name}
                </GeistText>
              )}
            </View>
          </View>

          {organization.address && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="location-outline" size={18} color="#52525B" />
                  <GeistText weight={400} style={styles.infoLabel}>
                    Адрес
                  </GeistText>
                </View>
                <GeistText weight={600} style={styles.infoValue}>
                  {organization.address}
                </GeistText>
              </View>
            </>
          )}
        </View>

        {/* Contact Information */}
        {organization.phones && organization.phones.length > 0 && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Контактная информация
            </GeistText>
            {organization.phones.map((phone, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.phoneRow,
                  index > 0 && styles.phoneRowWithBorder,
                ]}
                onPress={() => callPhone(phone)}
              >
                <View style={styles.infoLeft}>
                  <Ionicons name="call-outline" size={18} color="#52525B" />
                  <GeistText weight={400} style={styles.infoLabel}>
                    Телефон {index + 1}
                  </GeistText>
                </View>
                <GeistText weight={600} style={styles.phoneValue}>
                  {phone}
                </GeistText>
                <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Branch Information */}
        {branch && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Филиал
            </GeistText>
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons name="git-branch-outline" size={18} color="#52525B" />
                <GeistText weight={400} style={styles.infoLabel}>
                  Название филиала
                </GeistText>
              </View>
              <GeistText weight={600} style={styles.infoValue}>
                {branch.name}
              </GeistText>
            </View>
          </View>
        )}

        {/* Schedule */}
        <View style={styles.card}>
          <GeistText weight={600} style={styles.sectionTitle}>
            График работы
          </GeistText>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleLeft}>
              <Ionicons name="time-outline" size={18} color="#52525B" />
              <GeistText weight={400} style={styles.scheduleLabel}>
                Рабочее время
              </GeistText>
            </View>
            <GeistText weight={600} style={styles.scheduleValue}>
              {organization.time_from} - {organization.time_end}
            </GeistText>
          </View>
        </View>

        {/* Cooperation Period */}
        <View style={styles.card}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Период сотрудничества
          </GeistText>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="calendar-outline" size={18} color="#52525B" />
              <GeistText weight={400} style={styles.infoLabel}>
                Начало сотрудничества
              </GeistText>
            </View>
            <GeistText weight={600} style={styles.infoValue}>
              {organization.start_cooperation}
            </GeistText>
          </View>
          {organization.end_cooperation && (
            <View style={[styles.infoRow, styles.infoRowWithBorder]}>
              <View style={styles.infoLeft}>
                <Ionicons name="calendar-outline" size={18} color="#52525B" />
                <GeistText weight={400} style={styles.infoLabel}>
                  Окончание сотрудничества
                </GeistText>
              </View>
              <GeistText weight={600} style={styles.infoValue}>
                {organization.end_cooperation}
              </GeistText>
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.card}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Статистика
          </GeistText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.statLabel}>
                Сотрудники
              </GeistText>
              <GeistText weight={600} style={styles.statValue}>
                {employees.length}
              </GeistText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="home-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.statLabel}>
                Дома
              </GeistText>
              <GeistText weight={600} style={styles.statValue}>
                {houses.length}
              </GeistText>
            </View>
          </View>
        </View>

        {/* Employees List */}
        {employees.length > 0 && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Сотрудники ({employees.length})
            </GeistText>
            {employees.map((employee, index) => (
              <View
                key={employee.id}
                style={[
                  styles.employeeCard,
                  index > 0 && styles.employeeCardWithBorder,
                ]}
              >
                <View style={styles.employeeHeader}>
                  <View style={styles.employeeInfo}>
                    <GeistText weight={600} style={styles.employeeName}>
                      {employee.full_name}
                    </GeistText>
                    <GeistText weight={400} style={styles.employeePosition}>
                      {employee.position}
                    </GeistText>
                  </View>
                </View>
                {employee.phone && (
                  <TouchableOpacity
                    style={styles.employeePhone}
                    onPress={() => callPhone(employee.phone)}
                  >
                    <Ionicons name="call-outline" size={16} color="#52525B" />
                    <GeistText weight={500} style={styles.employeePhoneText}>
                      {employee.phone}
                    </GeistText>
                  </TouchableOpacity>
                )}
                {employee.note && (
                  <GeistText weight={400} style={styles.employeeNote}>
                    {employee.note}
                  </GeistText>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Houses List */}
        {houses.length > 0 && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Дома ({houses.length})
            </GeistText>
            <FlatList
              data={houses}
              keyExtractor={(house: House) => house.id.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item: house }: { item: House }) => (
                <TouchableOpacity
                  style={styles.houseCard}
                  onPress={() => router.push(`/houses/${house.id}`)}
                >
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
                          <GeistText
                            weight={500}
                            style={styles.commercialTextSmall}
                          >
                            Коммерция
                          </GeistText>
                        </View>
                      )}
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Note */}
        {organization.note && (
          <View style={styles.card}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Примечание
            </GeistText>
            <GeistText weight={400} style={styles.noteText}>
              {organization.note}
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
    paddingBottom: 130,
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
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginTop: 2,
  },
  orgTexts: {
    marginLeft: 12,
    flex: 1,
  },
  orgName: {
    fontSize: 19,
    color: '#18181B',
    lineHeight: 26,
  },
  orgFullName: {
    fontSize: 14,
    color: '#52525B',
    lineHeight: 20,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#18181B',
    marginBottom: 16,
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
    maxWidth: '50%',
  },
  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  phoneRowWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 10,
  },
  phoneValue: {
    fontSize: 14,
    color: '#18181B',
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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
  employeeCard: {
    paddingVertical: 12,
  },
  employeeCardWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 12,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    color: '#18181B',
    marginBottom: 2,
  },
  employeePosition: {
    fontSize: 13,
    color: '#71717A',
  },
  employeePhone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  employeePhoneText: {
    fontSize: 13,
    color: '#18181B',
    marginLeft: 6,
  },
  employeeNote: {
    fontSize: 13,
    color: '#52525B',
    marginTop: 8,
    fontStyle: 'italic',
  },
  noteText: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
  },
  separator: {
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: '#E5E7EB',
  },
  houseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  houseStats: {
    flexDirection: 'row',
    gap: 12,
  },
  houseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  houseStatText: {
    fontSize: 12,
    color: '#71717A',
  },
});

export default OrganizationDetailPage;
