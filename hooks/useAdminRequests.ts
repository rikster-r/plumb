import { useMemo } from 'react';
import useSWRNative from '@nandorojo/swr-react-native';
import useSWRInfinite from 'swr/infinite';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';

const ITEMS_PER_PAGE = 10;

export function useAdminRequests() {
  const { token } = useUser();

  const getKey = (pageIndex: number, previousPageData: Request[][] | null) => {
    if (previousPageData && previousPageData[0].length === 0) return null;

    const page = pageIndex + 1;

    return token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/requests?page=${page}`, token]
      : null;
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<Request[]>(
      getKey,
      ([url, token]) => fetcherWithToken(url, token),
      {
        revalidateFirstPage: false,
        revalidateAll: false,
      }
    );

  useSWRNative({ mutate });

  const requests = useMemo(() => {
    return data ? data.flat() : [];
  }, [data]);

  const pagination = useMemo(() => {
    if (!data) {
      return {
        currentPage: 0,
        itemsPerPage: ITEMS_PER_PAGE,
        hasMore: false,
      };
    }

    const lastPage = data?.[data.length - 1];
    const hasMore = lastPage ? lastPage.length > 0 : false;

    return {
      currentPage: size,
      itemsPerPage: ITEMS_PER_PAGE,
      hasMore,
    };
  }, [data, size]);

  const fetchNextPage = () => {
    if (pagination.hasMore && !isValidating) {
      setSize(size + 1);
    }
  };

  const refresh = () => mutate();

  return {
    requests,
    pagination,
    isLoading,
    isLoadingMore: isValidating && size > 1,
    error,
    fetchNextPage,
    refresh,
  };
}
