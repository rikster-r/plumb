import { useMemo } from 'react';
import useSWRNative from '@nandorojo/swr-react-native';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';

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

  const { data: branches } = useSWRNative<Branch[]>(
    user && token && house?.house_tariff?.branch_id
      ? [`${process.env.EXPO_PUBLIC_API_URL}/branches`, token]
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
      ? [`${process.env.EXPO_PUBLIC_API_URL}/address-types`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const branch = useMemo(() => {
    if (!branches || !house?.house_tariff?.branch_id) return null;
    return branches.find(
      (b) => b.id === parseInt(house.house_tariff.branch_id)
    );
  }, [branches, house?.house_tariff?.branch_id]);

  const addressType = useMemo(() => {
    if (!addressTypes || !house?.address_type_id) return null;

    return addressTypes.find((a) => a.id === house.address_type_id);
  }, [addressTypes, house?.address_type_id]);

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
