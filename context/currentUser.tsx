// import { createContext, useContext, useEffect, useState } from 'react';
// import * as SecureStore from 'expo-secure-store';
// import { useRouter } from 'expo-router';
// import useSWRNative from '@nandorojo/swr-react-native';
// import { KeyedMutator } from 'swr';

// interface UserContextType {
//   user: User | null;
//   login: (token: string, user: User) => Promise<void>;
//   logout: () => Promise<void>;
//   isLoading: boolean;
//   error: unknown;
//   mutate: KeyedMutator<{ user: User }>;
// }

// const TOKEN_KEY = 'authToken';
// const UserContext = createContext<UserContextType | null>(null);

// type ProviderProps = {
//   children: React.ReactNode;
// };

// const fetcher = async (url: string, token: string) => {
//   if (!token) return undefined;
//   const res = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!res.ok) return undefined;
//   return res.json();
// };

// export const UserProvider = ({ children }: ProviderProps) => {
//   const [token, setToken] = useState<string | null>(null);
//   const router = useRouter();

//   const { data, error, mutate, isLoading } = useSWRNative<{ user: User }>(
//     [`${process.env.EXPO_PUBLIC_API_URL}/api/users/profile`, token],
//     ([url, token]) => fetcher(url, token)
//   );

//   const user = data?.user ?? null;

//   useEffect(() => {
//     const loadToken = async () => {
//       const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
//       if (storedToken) {
//         setToken(storedToken);
//       }
//     };
//     loadToken();
//   }, []);

//   const login = async (newToken: string, user: User) => {
//     await SecureStore.setItemAsync(TOKEN_KEY, newToken);
//     setToken(newToken);
//     mutate();

//     // index redirects accordingly
//     router.replace('/requests');
//   };

//   const logout = async () => {
//     await SecureStore.deleteItemAsync(TOKEN_KEY);
//     setToken(null);
//     mutate(undefined, false);
//     // index redirects accordingly
//     router.replace('/(auth)/login');
//   };

//   return (
//     <UserContext.Provider
//       value={{ user, login, logout, isLoading, error, mutate }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };

import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface UserContextType {
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: unknown;
}

const TOKEN_KEY = 'authToken';
const UserContext = createContext<UserContextType | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: ProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<unknown>(null);

  const router = useRouter();

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
        setUser({
          id: 1,
          email: 'test@example.com',
          fullName: 'Григорьев Анатолий Генадьевич',
          phone: '89161234567',
          role: 'Мастер',
          access: 'open',
        });
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken: string, user: User) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(user);

    router.replace('/requests');
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);

    router.replace('/(auth)/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
