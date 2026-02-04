import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { statusConfig, priorityColors } from '@/constants/requests';
import { useRequests } from '@/hooks/useRequests';
import { useUser } from '@/context/currentUser';

interface RequestCardProps {
  request: Request;
  onPress?: (requestId: string) => void;
  isActive?: boolean;
  isOtherActive?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onPress,
  isActive = false,
  isOtherActive = false,
}) => {
  const { token } = useUser();
  const { refresh } = useRequests();

  const handleStatusChange = async () => {
    if (!request) return;
    const currentStatus = statusConfig[request.status];
    if (!currentStatus?.nextStatus) return;

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/requests/${request.id}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: currentStatus.sentAPIStatus }),
        },
      );

      if (response.ok) {
        refresh();
      } else {
        const errorData = await response.json();
        Alert.alert(
          'Ошибка',
          errorData.message || 'Не удалось изменить статус',
        );
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  const statusData = statusConfig[request.status] || {};

  const address =
    typeof request.house === 'object'
      ? (request.house?.full_address ?? 'Адрес не указан')
      : (request.house ?? 'Адрес не указан');
  const customer = request.customer || request.applicant || null;
  const problem = request.problem || request.problem_customer || null;

  const priority = request.priority
    ? request.priority[0].toUpperCase() + request.priority.slice(1)
    : '';

  // Определяем стили в зависимости от статуса
  const isGreyedOut = isOtherActive && !isActive;

  return (
    <TouchableOpacity
      style={[
        styles.requestCard,
        isActive && styles.requestCardActive,
        isGreyedOut && styles.requestCardGreyed,
      ]}
      onPress={() => onPress?.(String(request.id))}
      activeOpacity={0.7}
    >
      {/* HEADER */}
      <View style={styles.requestHeader}>
        <View style={styles.requestClient}>
          <GeistText
            weight={600}
            style={[styles.clientName, isGreyedOut && styles.textGreyed]}
          >
            {address}
          </GeistText>

          {customer && (
            <GeistText
              weight={400}
              style={[styles.clientAddress, isGreyedOut && styles.textGreyed]}
            >
              {customer}
            </GeistText>
          )}
        </View>
      </View>

      {/* PROBLEM */}
      {problem && (
        <GeistText
          weight={400}
          style={[styles.problemText, isGreyedOut && styles.textGreyed]}
          numberOfLines={2}
        >
          {problem}
        </GeistText>
      )}

      {/* DIVIDER */}
      {(problem || request.created_at || request.priority) && (
        <View style={[styles.divider, isGreyedOut && styles.dividerGreyed]} />
      )}

      {/* FOOTER */}
      <View style={styles.requestFooter}>
        {request.created_at ? (
          <GeistText
            weight={400}
            style={[styles.timeText, isGreyedOut && styles.textGreyed]}
          >
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
                color: isGreyedOut
                  ? '#A1A1AA'
                  : priorityColors[request.priority] || '#52525B',
              },
            ]}
          >
            {priority}
          </GeistText>
        )}
      </View>

      {isActive && (
        <View style={styles.bottomAction}>
          <TouchableOpacity
            onPress={handleStatusChange}
            style={styles.actionButton}
          >
            <GeistText weight={600} style={styles.actionButtonText}>
              {statusData.nextLabel}
            </GeistText>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomAction: {
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#1F5EDB',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
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
    marginBottom: 12,
  },
  requestCardActive: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  requestCardGreyed: {
    opacity: 1,
    backgroundColor: '#FAFAFA',
  },
  textGreyed: {
    color: '#A1A1AA',
  },
  statusBadgeGreyed: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E4E4E7',
  },
  dividerGreyed: {
    backgroundColor: '#E4E4E7',
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
  priorityText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
