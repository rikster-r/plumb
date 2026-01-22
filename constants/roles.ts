export const adminRoles = ['диспетчер', 'старший диспетчер', 'зам директор'];
export const userRoles = ['мастер', 'исполнитель', 'служебный транспорт'];

export const routes = {
  login: {
    fs: '/(auth)/login',
    public: '/login',
  },
  adminInitial: {
    fs: '/(tabs)/requests',
    public: '/requests',
  },
  userInitial: {
    fs: '/userRequests',
    public: '/userRequests',
  },
} as const;
