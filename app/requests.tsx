import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { statusConfig, statusTabs, priorityColors } from '@/constants/requests';
import { useUser } from '@/context/currentUser';

import { StatusTabs } from '@/components/StatusTabs';
import { RequestsPageHeader } from '@/components/RequestsPageHeader';
import { UserPopover } from '@/components/UserPopover';
import { RequestCardsList } from '@/components/RequestCardsList';
import { useRequests } from '@/hooks/useRequests';

const RequestsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('Актуальные');
  const [showUserPopover, setShowUserPopover] = useState(false);
  const { user, logout } = useUser();
  const router = useRouter();

  const { requests } = useRequests();

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

  const activeRequestsCount = useMemo(
    () =>
      (requests ?? []).filter(
        (r) => r.status !== 'Выполнена' && r.status !== 'Закрыта'
      ).length,
    [requests]
  );

  const handleLogout = async () => {
    setShowUserPopover(false);
    await logout();
  };

  const handleRequestPress = (requestId: string) => {
    router.push(`/requests/${requestId}`);
  };

  return (
    <View style={styles.container}>
      <RequestsPageHeader
        title="Заявки"
        subtitle={`Активных: ${activeRequestsCount}`}
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
      />
    </View>
  );
};

export default RequestsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
  },
});
