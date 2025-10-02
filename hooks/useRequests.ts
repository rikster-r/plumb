import { useEffect } from 'react';
import useSWRNative from '@nandorojo/swr-react-native';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import {
  Pusher,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

export function useRequests() {
  const { user, token } = useUser();

  const {
    data: requests,
    mutate,
    error,
    isLoading,
  } = useSWRNative<Request[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}/requests`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  useEffect(() => {
    let isMounted = true;
    let channel: PusherChannel | null = null;
    const pusherInst = Pusher.getInstance();

    async function setupPusher() {
      if (!user) return;

      const apiKey = process.env.EXPO_PUBLIC_PUSHER_API_KEY;
      const cluster = process.env.EXPO_PUBLIC_CLUSTER;
      
      if (!apiKey || !cluster) return;

      try {
        await pusherInst.init({
          apiKey,
          cluster,
          useTLS: true,
          onError: (msg, code, err) => {
            console.error('Pusher error', msg, code, err);
          },
        });

        await pusherInst.connect();

        const channelName = `App.Models.User.${user.id}`;
        channel = await pusherInst.subscribe({
          channelName,
          onEvent: (event: PusherEvent) => {
            if (!isMounted) return;

            if (event.eventName === 'application.updated') {
              try {
                const parsed = JSON.parse(event.data);
                if (parsed.user_id === user.id) return;

                mutate(); // refetch requests
              } catch (e) {
                console.error('Parsing pusher event data failed', e);
              }
            }
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.error('Failed to set up pusher');
      }
    }

    setupPusher();

    return () => {
      isMounted = false;

      const cleanup = async () => {
        if (channel) {
          await pusherInst.unsubscribe({ channelName: channel.channelName });
        }
        await pusherInst.disconnect();
      };

      cleanup();
    };
  }, [user, mutate]);

  return {
    requests,
    isLoading,
    error,
    refresh: mutate,
  };
}
