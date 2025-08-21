import LoadingScreen from '@/components/LoadingScreen';
import { useAppInitialization } from '@/hooks/useAppInitialization';

export default function Loading() {
  const { appError, retry } = useAppInitialization();

  return <LoadingScreen error={appError} onRetry={retry} />;
}
