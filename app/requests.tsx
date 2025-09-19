import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { Link } from 'expo-router';
import { useUser } from '@/context/currentUser';
import useSWRNative from '@nandorojo/swr-react-native';
import { fetcherWithToken } from '@/lib/fetcher';
import { statusConfig } from '@/constants/statusConfig';

const { width: screenWidth } = Dimensions.get('window');

const RequestsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('Актуальные');
  const [showUserPopover, setShowUserPopover] = useState(false);
  const { user, token, logout } = useUser();
  const { data: requests } = useSWRNative<Request[]>(
    [`${process.env.EXPO_PUBLIC_API_URL}/users/${user?.id}/requests`, token],
    ([url, token]) => fetcherWithToken(url, token)
  );

  const scrollViewRef = useRef<ScrollView>(null);

  const statusTabs = [
    'Актуальные',
    'Все',
    'Принята',
    'В пути',
    'На исполнении',
    'Выполнена',
    'Закрыта',
  ];

  const filteredRequests = useMemo(
    () =>
      (requests ?? []).filter((request) => {
        if (selectedStatus === 'Все') return true;
        if (selectedStatus === 'Актуальные')
          return request.status !== 'Выполнена' && request.status !== 'Закрыта';
        return request.status === selectedStatus;
      }),
    [selectedStatus, requests]
  );

  const priorityColors = {
    Высокий: '#C21818',
    Средний: '#B47D00',
    Низкий: '#0A7E5E',
  };

  const scrollToTab = (index: number) => {
    if (scrollViewRef.current) {
      // Get the width of the tab from styles (paddingHorizontal: 14, minWidth: 60, marginRight: 12)
      const tabWidth = 60 + 14 * 2; // minWidth + horizontal padding
      const tabMargin = 12;
      const totalTabWidth = tabWidth + tabMargin;

      // Calculate the x position of the tab's center
      const tabCenter = 24 + index * totalTabWidth + tabWidth / 2; // 24 is left padding

      // Scroll so that tabCenter is in the middle of the screen
      const scrollPosition = Math.max(0, tabCenter - screenWidth / 2);

      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  };

  const handleTabPress = (status: string) => {
    const tabIndex = statusTabs.indexOf(status);
    setSelectedStatus(status);
    scrollToTab(tabIndex);
  };

  const handleLogout = async () => {
    setShowUserPopover(false);
    await logout();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <GeistText weight={700} style={styles.mainTitle}>
              Заявки
            </GeistText>
            <GeistText weight={400} style={styles.subtitle}>
              Активных:{' '}
              {(requests ?? []).filter((r) => r.status !== 'завершена').length}
            </GeistText>
          </View>

          <TouchableOpacity
            style={styles.userButton}
            onPress={() => setShowUserPopover(true)}
          >
            <Ionicons name="person-circle-outline" size={32} color="#52525B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Popover Modal */}
      <Modal
        visible={showUserPopover}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserPopover(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowUserPopover(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.popover}>
                <View style={styles.popoverHeader}>
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={24} color="#52525B" />
                  </View>
                  <GeistText weight={600} style={styles.popoverTitle}>
                    Профиль
                  </GeistText>
                </View>

                <View style={styles.popoverContent}>
                  <View style={styles.userInfoItem}>
                    <GeistText weight={500} style={styles.userInfoLabel}>
                      ФИО
                    </GeistText>
                    <GeistText weight={400} style={styles.userInfoValue}>
                      {user?.name || 'Не указано'}
                    </GeistText>
                  </View>

                  <View style={styles.userInfoItem}>
                    <GeistText weight={500} style={styles.userInfoLabel}>
                      Email
                    </GeistText>
                    <GeistText weight={400} style={styles.userInfoValue}>
                      {user?.email || 'Не указан'}
                    </GeistText>
                  </View>

                  <View style={styles.userInfoItem}>
                    <GeistText weight={500} style={styles.userInfoLabel}>
                      Телефон
                    </GeistText>
                    <GeistText weight={400} style={styles.userInfoValue}>
                      {user?.phone ?? 'Не указан'}
                    </GeistText>
                  </View>

                  <View style={styles.dividerPopover} />

                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={20}
                      color="#C21818"
                    />
                    <GeistText weight={500} style={styles.logoutText}>
                      Выйти из аккаунта
                    </GeistText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {statusTabs.map((status) => {
              const isActive = selectedStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleTabPress(status)}
                  style={[
                    styles.tab,
                    isActive ? styles.activeTab : styles.inactiveTab,
                    { marginRight: 12 }, // replace gap
                  ]}
                >
                  <GeistText
                    weight={500}
                    style={[
                      styles.tabText,
                      isActive ? styles.activeTabText : styles.inactiveTabText,
                    ]}
                  >
                    {status === 'все'
                      ? 'Все'
                      : status.slice(0, 1).toUpperCase() + status.slice(1)}
                  </GeistText>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Requests List */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const statusStyle =
                statusConfig[request.status as keyof typeof statusConfig];
              return (
                <Link
                  href={{
                    pathname: '/requests/[id]',
                    params: { id: request.id },
                  }}
                  key={request.id}
                  style={styles.requestCard}
                >
                  <View style={{ width: '100%' }}>
                    <View style={styles.requestHeader}>
                      <View style={styles.requestClient}>
                        <GeistText weight={600} style={styles.clientName}>
                          {request.house}
                        </GeistText>
                        <GeistText weight={400} style={styles.clientAddress}>
                          {request.customer}
                        </GeistText>
                      </View>
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
                          style={[
                            styles.statusText,
                            { color: statusStyle.color },
                          ]}
                        >
                          {request.status.slice(0, 1).toUpperCase() +
                            request.status.slice(1)}
                        </GeistText>
                      </View>
                    </View>
                    <GeistText
                      weight={400}
                      style={styles.problemText}
                      numberOfLines={2}
                    >
                      {request.problem}
                    </GeistText>
                    <View style={styles.divider} />
                    <View style={styles.requestFooter}>
                      <GeistText weight={400} style={styles.timeText}>
                        {request.created_at.replace(' ', ' в ')}
                      </GeistText>
                      <View style={styles.footerRight}>
                        <GeistText
                          weight={500}
                          style={[
                            styles.priorityText,
                            {
                              color:
                                priorityColors[
                                  request.priority as keyof typeof priorityColors
                                ],
                            },
                          ]}
                        >
                          {request.priority.slice(0, 1).toUpperCase() +
                            request.priority.slice(1)}
                        </GeistText>
                      </View>
                    </View>
                  </View>
                </Link>
              );
            })
          ) : (
            <GeistText weight={400} style={styles.emptyText}>
              Нет заявок по заданным критериям.
            </GeistText>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RequestsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    color: '#09090B',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: '#52525B',
    marginTop: 4,
  },
  userButton: {
    padding: 4,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 10,
  },
  popover: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minWidth: 280,
    maxWidth: screenWidth - 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  popoverTitle: {
    fontSize: 18,
    color: '#09090B',
    lineHeight: 24,
  },
  popoverContent: {
    padding: 20,
  },
  userInfoItem: {
    marginBottom: 16,
  },
  userInfoLabel: {
    fontSize: 13,
    color: '#71717A',
    lineHeight: 18,
    marginBottom: 4,
  },
  userInfoValue: {
    fontSize: 15,
    color: '#18181B',
    lineHeight: 22,
  },
  dividerPopover: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginVertical: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 15,
    color: '#C21818',
    marginLeft: 8,
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  searchInputContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    fontSize: 16,
    color: '#18181B',
    fontFamily: 'Geist-Regular',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  tabsScroll: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#F0F5FF',
    borderColor: '#D0E0FF',
  },
  inactiveTab: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E4E4E7',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: '#1F5EDB',
  },
  inactiveTabText: {
    color: '#71717A',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  list: {
    paddingBottom: 32,
    gap: 12,
  },
  requestCard: {
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
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestClient: {
    flex: 1,
    marginRight: 12,
  },
  clientName: {
    fontSize: 17,
    color: '#18181B',
    lineHeight: 24,
  },
  clientAddress: {
    fontSize: 14,
    color: '#52525B',
    lineHeight: 20,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    minWidth: 60,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 13,
  },
  problemText: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginVertical: 8,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    color: '#71717A',
    flex: 1,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FEF7ED',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  badgeText: {
    fontSize: 11,
    color: '#9A4A00',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 15,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
});
