import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import useSWRNative from '@nandorojo/swr-react-native';
import { KeyedMutator } from 'swr';

interface UserContextType {
  user: User | undefined;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: unknown;
  mutate: KeyedMutator<User>;
}

const TOKEN_KEY = 'authToken';
const UserContext = createContext<UserContextType | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

const fetcher = async (url: string, token: string) => {
  if (!token) return undefined;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return undefined;
  return res.json();
};

export const UserProvider = ({ children }: ProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const {
    data: user,
    error,
    mutate: mutateUser,
    isLoading,
  } = useSWRNative<User>(
    [`${process.env.EXPO_PUBLIC_API_URL}/auth/profile`, token],
    ([url, token]) => fetcher(url, token)
  );

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const login = async (newToken: string, user: User) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
    mutateUser(user);

    // index redirects accordingly
    // user role check
    // if (user.role === 'admin') {
    //   router.replace('/(tabs)/requests');
    // } else {
    //   router.replace('/requests');
    // }
    router.replace('/requests');
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    mutateUser(undefined, false);

    // index redirects accordingly
    router.replace('/(auth)/login');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        error,
        mutate: mutateUser,
      }}
    >
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
