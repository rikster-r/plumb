import { useUser } from '@/context/currentUser';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { user, isLoading } = useUser();

  if (user && !isLoading) {
    return;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
