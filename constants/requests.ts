import { Ionicons } from '@expo/vector-icons';

export const statusConfig: Record<
  string,
  {
    color: string;
    backgroundColor: string;
    borderColor: string;
    icon: keyof typeof Ionicons.glyphMap;
    sentAPIStatus?: string | null;
    nextStatus: string | null;
    nextLabel: string | null;
  }
> = {
  Принята: {
    color: '#1F5EDB',
    backgroundColor: '#F0F5FF',
    borderColor: '#D0E0FF',
    icon: 'alert-circle-outline',
    sentAPIStatus: 'В пути',
    nextStatus: 'В пути',
    nextLabel: 'Выехать',
  },
  'В пути': {
    color: '#B47D00',
    backgroundColor: '#FFF8E6',
    borderColor: '#FFECB3',
    icon: 'car-outline',
    sentAPIStatus: 'В работе',
    nextStatus: 'На исполнении',
    nextLabel: 'Начать работу',
  },
  'На исполнении': {
    color: '#0A7E5E',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: 'construct-outline',
    sentAPIStatus: 'Завершена',
    nextStatus: 'Выполнена',
    nextLabel: 'Завершить',
  },
  Выполнена: {
    color: '#4B5563',
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    icon: 'checkmark-circle-outline',
    sentAPIStatus: null,
    nextStatus: null,
    nextLabel: null,
  },
  Закрыта: {
    color: '#71717A',
    backgroundColor: '#F4F4F5',
    borderColor: '#E4E4E7',
    icon: 'lock-closed-outline',
    sentAPIStatus: null,
    nextStatus: null,
    nextLabel: null,
  },
};

export const statusTabs = [
  'Актуальные',
  'Все',
  'Принята',
  'В пути',
  'На исполнении',
  'Выполнена',
  'Закрыта',
];

export const priorityColors = {
  Высокий: '#C21818',
  Средний: '#B47D00',
  Низкий: '#0A7E5E',
};
