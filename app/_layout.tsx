import { usePathname, Stack, useRouter } from 'expo-router';
import { UserProvider, useUser } from '@/context/currentUser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import * as NavigationBar from 'expo-navigation-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

function AppContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAppReady, appError } = useAppInitialization();
  const { user } = useUser();

  useEffect(() => {
    NavigationBar.setButtonStyleAsync('dark');
  }, [pathname]);

  useEffect(() => {
    if (isAppReady && !appError) {
      const target = user ? '/requests' : '/(auth)/login';
      router.replace(target);
    }
  }, [isAppReady, router, user, appError]);

  useEffect(() => {
    if (isAppReady && !appError) {
      const target = user ? '/requests' : '/login';

      if (pathname === target) {
        SplashScreen.hideAsync();
      }
    }
  }, [pathname, isAppReady, user, appError]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen name="index" />
        <Stack.Screen name="requests" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="(modals)/ImageViewer"
          options={{
            presentation: 'transparentModal', // or "modal"
            animation: 'fade',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}
