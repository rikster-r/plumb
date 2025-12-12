import { usePathname, Stack, useRouter } from 'expo-router';
import { UserProvider, useUser } from '@/context/currentUser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import * as NavigationBar from 'expo-navigation-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

const ROUTES = {
  login: {
    fs: '/(auth)/login',
    public: '/login',
  },
  adminInitial: {
    fs: '/(tabs)/requests',
    public: '/requests',
  },
  userInitial: {
    fs: '/requests',
    public: '/requests',
  },
} as const;

function AppContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAppReady, appError } = useAppInitialization();
  const { user } = useUser();
  // const target = !user
  //   ? ROUTES.login
  //   : user.role === 'admin'
  //     ? ROUTES.adminInitial
  //     : ROUTES.userInitial;
  const target = !user ? ROUTES.login : ROUTES.adminInitial;

  useEffect(() => {
    NavigationBar.setButtonStyleAsync('dark');
  }, [pathname]);

  // Redirect to appropriate initial screen once app is ready
  useEffect(() => {
    if (!isAppReady || appError) return;

    router.replace(target.fs);
  }, [isAppReady, appError, user, router, target]);

  // Hide splash screen when on the correct screen
  useEffect(() => {
    if (!isAppReady || appError) return;

    if (pathname === target.public) {
      SplashScreen.hideAsync();
    }
  }, [pathname, isAppReady, user, appError, target]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen name="index" />
        <Stack.Screen name="requests" />
        <Stack.Screen name="(tabs)" />
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
        <BottomSheetModalProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}
