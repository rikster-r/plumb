import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';
import { useMemo } from 'react';

export function useDeduplicatedSchedules() {
  const { user, token } = useUser();

  const {
    data: schedulesRaw,
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useSWRNative<Schedule[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/schedules`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // Deduplicate schedules
  const schedules = useMemo(() => {
    if (!schedulesRaw) return [];
    const map = new Map<string, Schedule>();
    for (const s of schedulesRaw) {
      const key = `${s.working}-${s.day_off}-${s.start_time}-${s.end_time}`;
      if (!map.has(key)) map.set(key, s);
    }
    return Array.from(map.values());
  }, [schedulesRaw]);

  return { schedules, schedulesLoading, schedulesError };
}
