import React, { useMemo, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { statusConfig, statusTabs, priorityColors } from '@/constants/requests';
import { useUser } from '@/context/currentUser';
import { StatusTabs } from '@/components/StatusTabs';
import { RequestsPageHeader } from '@/components/RequestsPageHeader';
import { UserPopover } from '@/components/UserPopover';
import { RequestCardsList } from '@/components/RequestCardsList';
import { useAdminRequests } from '@/hooks/useAdminRequests';

const AdminRequestsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('Актуальные');
  const [showUserPopover, setShowUserPopover] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();

  const {
    requests,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    fetchNextPage,
    refresh,
  } = useAdminRequests();

  const filteredRequests = useMemo(() => {
    if (selectedStatus === 'Все') return requests;
    if (selectedStatus === 'Актуальные') {
      return requests.filter(
        (request) =>
          request.status !== 'Выполнена' && request.status !== 'Закрыта'
      );
    }
    return requests.filter((request) => request.status === selectedStatus);
  }, [selectedStatus, requests]);

  const handleLogout = async () => {
    setShowUserPopover(false);
    await logout();
  };

  const handleRequestPress = (requestId: string) => {
    router.push({
      pathname: `/requests/[id]`,
      params: { id: requestId },
    });
  };

  const handleEndReached = () => {
    if (pagination.hasMore && !isLoadingMore) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <RequestsPageHeader
          title="Все заявки"
          subtitle="Загрузка..."
          onUserPress={() => setShowUserPopover(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <RequestsPageHeader
          title="Все заявки"
          subtitle="Ошибка"
          onUserPress={() => setShowUserPopover(true)}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || 'Не удалось загрузить заявки'}
          </Text>
          <Text style={styles.retryText} onPress={refresh}>
            Повторить попытку
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RequestsPageHeader
        title="Все заявки"
        onUserPress={() => setShowUserPopover(true)}
      />

      <UserPopover
        visible={showUserPopover}
        user={user}
        onClose={() => setShowUserPopover(false)}
        onLogout={handleLogout}
      />

      <StatusTabs
        tabs={statusTabs}
        selected={selectedStatus}
        onSelect={setSelectedStatus}
      />

      <RequestCardsList
        requests={filteredRequests}
        statusConfig={statusConfig}
        priorityColors={priorityColors}
        onRequestPress={handleRequestPress}
        onEndReached={handleEndReached}
        onRefresh={refresh}
        refreshing={isLoading}
        ListFooterComponent={
          <View
            style={[styles.footerLoader, { opacity: isLoadingMore ? 1 : 0 }]}
          >
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.footerText}>Загрузка</Text>
          </View>
        }
      />
    </View>
  );
};

export default AdminRequestsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
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
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
});
