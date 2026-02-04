import { GeistText } from '@/components/GeistText';
import React, { useRef, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { RequestCard } from './RequestCard';
import { inWorkStatuses } from '@/constants/requests';

interface RequestsListProps {
  requests: Request[];
  onRequestPress?: (requestId: string) => void;
  emptyMessage?: string;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListFooterComponent?: React.ReactElement | null;
  singleActiveRequestMode?: boolean;
  isLoadingMore?: boolean;
}

export const RequestCardsList: React.FC<RequestsListProps> = ({
  requests,
  onRequestPress,
  emptyMessage = 'Нет заявок по заданным критериям.',
  onEndReached,
  onRefresh,
  refreshing = false,
  ListFooterComponent,
  singleActiveRequestMode = true,
  isLoadingMore
}) => {
  const { data, activeRequest } = useMemo(() => {
    if (!singleActiveRequestMode) {
      return {
        data: requests,
        activeRequest: undefined,
      };
    }

    const active = requests.find((r) => inWorkStatuses.includes(r.status));
    const others = active
      ? requests.filter((r) => r.id !== active.id)
      : requests;

    return {
      data: active ? [active, ...others] : requests,
      activeRequest: active,
    };
  }, [requests, singleActiveRequestMode]);

  const hasActiveRequest = Boolean(activeRequest);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      windowSize={8}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      removeClippedSubviews
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => {
        const isActive =
          singleActiveRequestMode && activeRequest?.id === item.id;

        return (
          <RequestCard
            request={item}
            onPress={onRequestPress}
            isActive={isActive}
            isOtherActive={
              singleActiveRequestMode && hasActiveRequest && !isActive
            }
          />
        );
      }}
      ListFooterComponent={isLoadingMore ? ListFooterComponent : null}
      ListEmptyComponent={
        <GeistText weight={400} style={styles.emptyText}>
          {refreshing ? emptyMessage : ''}
        </GeistText>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 15,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
});
