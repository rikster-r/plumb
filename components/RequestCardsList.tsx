import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GeistText } from '@/components/GeistText';
import { RequestCard } from './RequestCard';

interface RequestsListProps {
  requests: Request[];
  statusConfig: Record<string, any>;
  priorityColors: Record<string, string>;
  onRequestPress?: (requestId: string) => void;
  emptyMessage?: string;
}

export const RequestCardsList: React.FC<RequestsListProps> = ({
  requests,
  statusConfig,
  priorityColors,
  onRequestPress,
  emptyMessage = 'Нет заявок по заданным критериям.',
}) => {
  return (
    <ScrollView
      style={styles.listContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.list}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              statusConfig={statusConfig}
              priorityColors={priorityColors}
              onPress={onRequestPress}
            />
          ))
        ) : (
          <GeistText weight={400} style={styles.emptyText}>
            {emptyMessage}
          </GeistText>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  list: {
    paddingBottom: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
});
