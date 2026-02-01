import { statusTabs } from '@/constants/requests';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { RequestCardsList } from '@/components/requests/RequestCardsList';
import { StatusTabs } from '@/components/StatusTabs';
import { useRequests } from '@/hooks/useRequests';

const RequestsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('Активные');
  const router = useRouter();

  const { requests } = useRequests();

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

          if (selectedStatus === 'На исполнении') {
            return ['На исполнении', 'Прибыл'].includes(request.status);
          }

          return request.status === selectedStatus;
        }),
    [selectedStatus, requests],
  );

  const activeRequestsCount = useMemo(
    () =>
      (requests ?? []).filter(
        (r) => r.status !== 'Выполнена' && r.status !== 'Закрыта',
      ).length,
    [requests],
  );

  const handleRequestPress = (requestId: string) => {
    router.push(`/requests/${requestId}`);
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Заявки"
        subtitle={`Активных: ${activeRequestsCount}`}
      />

      <StatusTabs
        tabs={statusTabs}
        selected={selectedStatus}
        onSelect={setSelectedStatus}
      />

      <RequestCardsList
        requests={filteredRequests}
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
