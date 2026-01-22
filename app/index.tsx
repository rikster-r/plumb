import LoadingScreen from '@/components/LoadingScreen';
import { Redirect } from 'expo-router';
import { useUser } from '@/context/currentUser';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { adminRoles, routes } from '@/constants/roles';

export default function Index() {
  const { isAppReady, appError, retry } = useAppInitialization();
  const { user, isLoading } = useUser();

  if (!isAppReady || isLoading) {
    return <LoadingScreen error={appError} onRetry={retry} />;
  }

  if (!user) {
    return <Redirect href={routes.login.fs} />;
  }

  return (
    <Redirect
      href={
        adminRoles.includes(user.role.toLowerCase())
          ? routes.adminInitial.fs
          : routes.userInitial.fs
      }
    />
  );
}
