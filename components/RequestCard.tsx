import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface RequestCardProps {
  request: Request;
  statusConfig: Record<string, any>;
  priorityColors: Record<string, string>;
  onPress?: (requestId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  statusConfig,
  priorityColors,
  onPress,
}) => {
  const statusStyle = statusConfig[request.status as keyof typeof statusConfig];

  return (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => onPress?.(String(request.id))}
      activeOpacity={0.7}
    >
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
              backgroundColor: statusStyle?.backgroundColor || '#F5F5F5',
              borderColor: statusStyle?.borderColor || '#E4E4E7',
            },
          ]}
        >
          <Ionicons
            name={statusStyle?.icon || 'help-outline'}
            size={14}
            color={statusStyle?.color || '#52525B'}
          />
          <GeistText
            weight={500}
            style={[
              styles.statusText,
              { color: statusStyle?.color || '#52525B' },
            ]}
          >
            {request.status.slice(0, 1).toUpperCase() + request.status.slice(1)}
          </GeistText>
        </View>
      </View>

      <GeistText weight={400} style={styles.problemText} numberOfLines={2}>
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
                  ] || '#52525B',
              },
            ]}
          >
            {request.priority.slice(0, 1).toUpperCase() +
              request.priority.slice(1)}
          </GeistText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 12,
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
  priorityText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
