import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { useUser } from '@/context/currentUser';

export const useAppInitialization = () => {
  const [appError, setAppError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const {
    user,
    isLoading: authLoading,
    error: authError,
    mutate: refetchUser,
  } = useUser();

  const [fontsLoaded] = useFonts({
    'Geist-Light': require('@/assets/fonts/Geist-Light.ttf'), //300
    'Geist-Regular': require('@/assets/fonts/Geist-Regular.ttf'), //400
    'Geist-Medium': require('@/assets/fonts/Geist-Medium.ttf'), //500
    'Geist-SemiBold': require('@/assets/fonts/Geist-SemiBold.ttf'), //600
    'Geist-Bold': require('@/assets/fonts/Geist-Bold.ttf'), //700
  });

  // Check if all critical data is loaded
  const isDataReady = !authLoading
  const isAppReady = fontsLoaded && isDataReady && !appError;

  // Handle errors
  useEffect(() => {
    if (authError) {
      setAppError(
        new Error(
          'Не удалось загрузить данные пользователя. Пожалуйста, проверьте ваше интернет-подключение.'
        )
      );
    } else {
      setAppError(null);
    }
  }, [authError]);

  // Retry function
  const retry = async () => {
    try {
      setAppError(null);
      setRetryCount((prev) => prev + 1);

      // Refetch user data if there was an auth error
      if (authError && refetchUser) {
        await refetchUser();
      }

    } catch (error) {
      setAppError(
        new Error(
          'Не удалось повторить попытку. Пожалуйста, попробуйте еще раз.'
        )
      );
    }
  };

  return {
    isAppReady,
    user,
    appError,
    isLoading: !isAppReady,
    retry,
    retryCount,
  };
};
