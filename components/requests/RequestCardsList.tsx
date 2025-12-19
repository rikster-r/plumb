import { GeistText } from '@/components/GeistText';
import React, { useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { RequestCard } from './RequestCard';

interface RequestsListProps {
  requests: Request[];
  statusConfig: Record<string, any>;
  priorityColors: Record<string, string>;
  onRequestPress?: (requestId: string) => void;
  emptyMessage?: string;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListFooterComponent?: React.ReactElement | null;
}

export const RequestCardsList: React.FC<RequestsListProps> = ({
  requests,
  statusConfig,
  priorityColors,
  onRequestPress,
  emptyMessage = 'Нет заявок по заданным критериям.',
  onEndReached,
  onRefresh,
  refreshing = false,
  ListFooterComponent,
}) => {
  const canLoadMore = useRef(true);

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      windowSize={8}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      removeClippedSubviews={true}
      onMomentumScrollBegin={() => {
        canLoadMore.current = true;
      }}
      onEndReached={() => {
        if (!canLoadMore.current) return;
        canLoadMore.current = false;
        onEndReached?.();
      }}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => (
        <RequestCard
          request={item}
          statusConfig={statusConfig}
          priorityColors={priorityColors}
          onPress={onRequestPress}
        />
      )}
      ListFooterComponent={canLoadMore ? ListFooterComponent : null}
      ListEmptyComponent={
        <GeistText weight={400} style={styles.emptyText}>
          {emptyMessage}
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
