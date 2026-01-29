import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { statusConfig, priorityColors } from '@/constants/requests';

interface RequestCardProps {
  request: Request;
  onPress?: (requestId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onPress,
}) => {
  const statusData = statusConfig[request.status] || {};

  const address =
    (typeof request.house === 'object' && request.house?.full_address) ||
    request.organization ||
    'Адрес не указан';
  const customer = request.customer || request.applicant || null;
  const problem = request.problem || request.problem_customer || null;

  const priority = request.priority
    ? request.priority[0].toUpperCase() + request.priority.slice(1)
    : '';

  return (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => onPress?.(String(request.id))}
      activeOpacity={0.7}
    >
      {/* HEADER */}
      <View style={styles.requestHeader}>
        <View style={styles.requestClient}>
          <GeistText weight={600} style={styles.clientName}>
            {address}
          </GeistText>

          {customer && (
            <GeistText weight={400} style={styles.clientAddress}>
              {customer}
            </GeistText>
          )}
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusData.backgroundColor || '#F5F5F5',
              borderColor: statusData.borderColor || '#E4E4E7',
            },
          ]}
        >
          <Ionicons
            name={statusData.icon || 'help-outline'}
            size={14}
            color={statusData.color || '#52525B'}
          />
          <GeistText
            weight={500}
            style={[
              styles.statusText,
              { color: statusData.color || '#52525B' },
            ]}
          >
            {statusData.label}
          </GeistText>
        </View>
      </View>

      {/* PROBLEM — only render if exists */}
      {problem && (
        <GeistText weight={400} style={styles.problemText} numberOfLines={2}>
          {problem}
        </GeistText>
      )}

      {/* DIVIDER — only show if there is problem or useful footer */}
      {(problem || request.created_at || request.priority) && (
        <View style={styles.divider} />
      )}

      {/* FOOTER */}
      <View style={styles.requestFooter}>
        {request.created_at ? (
          <GeistText weight={400} style={styles.timeText}>
            {request.created_at.replace(' ', ' в ')}
          </GeistText>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {priority && (
          <GeistText
            weight={500}
            style={[
              styles.priorityText,
              {
                color: priorityColors[request.priority] || '#52525B',
              },
            ]}
          >
            {priority}
          </GeistText>
        )}
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
