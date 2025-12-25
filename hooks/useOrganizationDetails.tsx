import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

export const useOrganizationDetails = (id: string) => {
  const { user, token } = useUser();
  const canFetch = Boolean(user && token && id);

  const {
    data: organization,
    error: organizationError,
    isLoading,
    mutate,
  } = useSWRNative<OrganizationDetailed>(
    canFetch
      ? [`${process.env.EXPO_PUBLIC_API_URL}/organizations/${id}`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // branch (depends on organization)
  const { data: branch } = useSWRNative<Branch>(
    organization?.branch_id
      ? [
          `${process.env.EXPO_PUBLIC_API_URL}/branches/${organization.branch_id}`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // employees
  const { data: employees = [] } = useSWRNative<Employee[]>(
    canFetch
      ? [
          `${process.env.EXPO_PUBLIC_API_URL}/organizations/${id}/employees`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // houses ids
  const { data: housesIds = [] } = useSWRNative<number[]>(
    canFetch
      ? [`${process.env.EXPO_PUBLIC_API_URL}/organizations/${id}/houses`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const houseKeys: [string, string][] = housesIds.map((houseId) => [
    `${process.env.EXPO_PUBLIC_API_URL}/houses/${houseId}`,
    token!,
  ]);

  const { data: houses = [] } = useSWRNative<House[]>(
    houseKeys.length ? houseKeys : null,
    (keys: [string, string][]) =>
      Promise.all(keys.map(([url, token]) => fetcherWithToken(url, token)))
  );

  return {
    organization,
    branch,
    employees,
    houses,
    isLoading,
    error: organizationError,
    mutateOrganization: mutate,
  };
};
