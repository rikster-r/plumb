import { Ionicons } from '@expo/vector-icons';

export type StatusData = {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  sentAPIStatus?: string | null; // value that gets sent to API to change status to next
  nextStatus: string | null; // status that follows after current
  nextLabel: string | null; // action name to change current status to next
};

export const statusConfig: Record<string, StatusData> =
  // status itself
  {
    'Отправлено исполнителю': {
      label: 'Отправлено исполнителю',
      color: '#D97706',
      backgroundColor: '#FFFBEB',
      borderColor: '#FDE68A',
      icon: 'paper-plane-outline',
      sentAPIStatus: 'accepted_by_executor',
      nextStatus: 'Принято исполнителем',
      nextLabel: 'Принять заявку',
    },
    'Принято исполнителем': {
      label: 'Принято',
      color: '#2563EB',
      backgroundColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: 'book-outline',
      sentAPIStatus: 'in_transit',
      nextStatus: 'На исполнении',
      nextLabel: 'Выехать на заявку',
    },
    'На исполнении': {
      label: 'На исполнении',
      color: '#0A7E5E',
      backgroundColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: 'construct-outline',
      sentAPIStatus: 'arrived',
      nextStatus: 'Прибыл',
      nextLabel: 'Прибыл',
    },
    Прибыл: {
      label: 'На исполнении',
      color: '#0A7E5E',
      backgroundColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: 'construct-outline',
      sentAPIStatus: 'completed',
      nextStatus: 'Выполнена',
      nextLabel: 'Заявка выполнена',
    },
    Выполнена: {
      label: 'Выполнена',
      color: '#4B5563',
      backgroundColor: '#F9FAFB',
      borderColor: '#D1D5DB',
      icon: 'checkmark-circle-outline',
      sentAPIStatus: null,
      nextStatus: null,
      nextLabel: null,
    },
    Отменена: {
      label: 'Отменена',
      color: '#DC2626',
      backgroundColor: '#FEF2F2',
      borderColor: '#FECACA',
      icon: 'close-circle-outline',
      sentAPIStatus: null,
      nextStatus: null,
      nextLabel: null,
    },
    Закрыта: {
      label: 'Закрыта',
      color: '#71717A',
      backgroundColor: '#F4F4F5',
      borderColor: '#E4E4E7',
      icon: 'lock-closed-outline',
      sentAPIStatus: null,
      nextStatus: null,
      nextLabel: null,
    },
  };

export const statusTabs: string[] = [
  'Активные',
  'На исполнении',
  'Выполнена',
  'Отменена',
];

export const adminStatusTabs: string[] = [
  'Активные',
  'Все',
  'На исполнении',
  'Выполнена',
  'Отменена',
  'Закрыта',
];

export const priorityColors: Record<string, string> = {
  Высокий: '#C21818',
  Средний: '#B47D00',
  Низкий: '#0A7E5E',
};
