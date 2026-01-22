import { usePathname, Stack } from 'expo-router';
import { UserProvider, useUser } from '@/context/currentUser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import * as NavigationBar from 'expo-navigation-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { adminRoles, routes } from '@/constants/roles';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

function AppContent() {
  const pathname = usePathname();
  const { isAppReady, appError } = useAppInitialization();
  const { user } = useUser();
  const target = !user
    ? routes.login
    : adminRoles.includes(user.role.toLowerCase())
      ? routes.adminInitial
      : routes.userInitial;

  useEffect(() => {
    NavigationBar.setButtonStyleAsync('dark');
  }, [pathname]);

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
        <Stack.Screen name="userRequests" />
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
