import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';
import { useMemo } from 'react';

export function useHouseDetails(id: string) {
  const { user, token } = useUser();

  const {
    data: house,
    error,
    isLoading,
    mutate,
  } = useSWRNative<HouseDetailed>(
    user && token && id
      ? [`${process.env.EXPO_PUBLIC_API_URL}/houses/${id}`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const { data: branch } = useSWRNative<Branch>(
    user && token && house?.house_tariff?.branch_id
      ? [
          `${process.env.EXPO_PUBLIC_API_URL}/branches/${house.house_tariff.branch_id}`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const { data: organization } = useSWRNative<OrganizationDetailed>(
    user && token && house?.house_tariff?.organization_id
      ? [
          `${process.env.EXPO_PUBLIC_API_URL}/organizations/${house.house_tariff.organization_id}`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const { data: addressTypes } = useSWRNative<AddressType[]>(
    user && token && house?.address_type_id
      ? [
          `${process.env.EXPO_PUBLIC_API_URL}/address-types/${house.address_type_id}`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const addressType = useMemo(() => {
    return addressTypes ?? null;
  }, [addressTypes]);

  return {
    house,
    branch,
    organization,
    addressType,
    error,
    isLoading,
    mutate,
  };
}
