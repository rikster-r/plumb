import { Redirect, Tabs } from 'expo-router'
import { useUser } from '@/context/currentUser'

export default function AdminTabsLayout() {
  const { user, isLoading } = useUser()

  if (isLoading) return null

  if (!user) {
    return <Redirect href="/(auth)/login" />
  }

  // user role check
  // if (user.role !== 'admin') {
  //   return <Redirect href="/requests" />
  // }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="requests"
        options={{ title: 'Requests' }}
      />
    </Tabs>
  )
}
