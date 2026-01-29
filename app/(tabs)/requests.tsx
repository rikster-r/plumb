import { adminStatusTabs as statusTabs } from '@/constants/requests';
import { useAdminRequests } from '@/hooks/useAdminRequests';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { GeistText } from '@/components/GeistText';
import { PageHeader } from '@/components/PageHeader';
import { RequestCardsList } from '@/components/requests/RequestCardsList';
import { StatusTabs } from '@/components/StatusTabs';

const AdminRequestsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('Активные');
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

  const filteredRequests = useMemo(
    () =>
      (requests ?? [])
        .filter((request) => {
          return request.status !== 'Принята';
        })
        .filter((request) => {
          if (selectedStatus === 'Активные')
            return !['Выполнена', 'Закрыта', 'Отменена'].includes(
              request.status,
            );
          if (selectedStatus === 'Все') {
            return true;
          }
          return request.status === selectedStatus;
        }),
    [selectedStatus, requests],
  );

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
        <PageHeader title="Все заявки" subtitle="Загрузка..." />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <PageHeader title="Все заявки" subtitle="Ошибка" />
        <View style={styles.errorContainer}>
          <GeistText style={styles.errorText}>
            {error?.message || 'Не удалось загрузить заявки'}
          </GeistText>
          <GeistText style={styles.retryText} onPress={refresh}>
            Повторить попытку
          </GeistText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Все заявки" />

      <StatusTabs
        tabs={statusTabs}
        selected={selectedStatus}
        onSelect={setSelectedStatus}
      />

      <RequestCardsList
        requests={filteredRequests}
        onRequestPress={handleRequestPress}
        onEndReached={handleEndReached}
        onRefresh={refresh}
        refreshing={isLoading}
        ListFooterComponent={
          <View
            style={[styles.footerLoader, { opacity: isLoadingMore ? 1 : 0 }]}
          >
            <ActivityIndicator size="small" color="#007AFF" />
            <GeistText style={styles.footerText}>Загрузка</GeistText>
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
