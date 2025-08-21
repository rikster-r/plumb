import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { requests } from '@/lib/data';
import { Link } from 'expo-router';

const RequestsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('все');
  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        if (selectedStatus === 'все') return true;
        return request.status === selectedStatus;
      }),
    [selectedStatus]
  );

  const statusConfig: Record<
    string,
    {
      color: string;
      backgroundColor: string;
      borderColor: string;
      icon: keyof typeof Ionicons.glyphMap;
    }
  > = {
    новая: {
      color: '#1F5EDB',
      backgroundColor: '#F0F5FF',
      borderColor: '#D0E0FF',
      icon: 'alert-circle-outline',
    },
    'в пути': {
      color: '#B47D00',
      backgroundColor: '#FFF8E6',
      borderColor: '#FFECB3',
      icon: 'car-outline',
    },
    'в работе': {
      color: '#0A7E5E',
      backgroundColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: 'construct-outline',
    },
    завершена: {
      color: '#4B5563',
      backgroundColor: '#F9FAFB',
      borderColor: '#D1D5DB',
      icon: 'checkmark-circle-outline',
    },
  };

  const priorityColors = {
    высокий: '#C21818',
    средний: '#B47D00',
    низкий: '#0A7E5E',
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const statusTabs = ['все', 'новая', 'в пути', 'в работе', 'завершена'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GeistText weight={700} style={styles.mainTitle}>
          Заявки
        </GeistText>
        <GeistText weight={400} style={styles.subtitle}>
          Активных: {requests.filter((r) => r.status !== 'завершена').length}
        </GeistText>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
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
                  onPress={() => setSelectedStatus(status)}
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
                  <View style={styles.requestHeader}>
                    <View style={styles.requestClient}>
                      <GeistText weight={600} style={styles.clientName}>
                        {request.client.name}
                      </GeistText>
                      <GeistText weight={400} style={styles.clientAddress}>
                        {request.address.house}
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
                    {request.problem.description}
                  </GeistText>

                  <View style={styles.divider} />

                  <View style={styles.requestFooter}>
                    <GeistText weight={400} style={styles.timeText}>
                      {formatDate(request.createdAt)} в{' '}
                      {formatTime(request.createdAt)}
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
  mainTitle: {
    fontSize: 28,
    color: '#09090B',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: '#52525B',
    marginTop: 4,
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

export default RequestsPage;
