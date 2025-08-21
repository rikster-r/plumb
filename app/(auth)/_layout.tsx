import { useUser } from '@/context/currentUser';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { user, isLoading } = useUser();

  if (!isLoading && user) {
    return <Redirect href="/requests" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
