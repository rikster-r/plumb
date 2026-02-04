import { GeistText } from '@/components/GeistText';
import { useUser } from '@/context/currentUser';
import { useRequestActions } from '@/hooks/useRequestActions';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { inWorkStatuses, statusConfig } from '../../constants/requests';

// Import components
import RequestDetailsSkeleton from '@/components/requests/requestDetailsSections/RequestDetailsSkeleton';
import ImagesSection from '../../components/requests/requestDetailsSections/ImagesSection';
import {
  InfoRow,
  InfoSection,
} from '../../components/requests/requestDetailsSections/InfoSection';
import NotesSection from '../../components/requests/requestDetailsSections/NotesSection';
import ProblemSection from '../../components/requests/requestDetailsSections/ProblemSection';
import RequestHeader from '../../components/requests/RequestHeader';
import { useRequests } from '@/hooks/useRequests';

const RequestDetailsPage = () => {
  const { id: requestId } = useLocalSearchParams();
  const { token } = useUser();
  const { requests } = useRequests();

  const {
    data: request,
    isLoading,
    mutate,
  } = useSWRNative<Request>(
    [`${process.env.EXPO_PUBLIC_API_URL}/requests/${requestId}`, token],
    ([url, token]) => fetcherWithToken(url, token),
  );
  const { handleStatusChange, handleAddFile, handleNoteChange } =
    useRequestActions({
      request,
      requestId: Number(requestId),
      token: token || '',
      mutate,
    });

  // Находим активную заявку и сортируем: активная всегда сверху
  const activeRequest = useMemo(
    () => requests.find((r) => inWorkStatuses.includes(r.status)),
    [requests],
  );

  const handleImagePress = (index: number) => {
    if (!request) return;

    router.push({
      pathname: '/(modals)/ImageViewer',
      params: {
        files: JSON.stringify(request.files),
        selectedIndex: index,
      },
    });
  };

  if (!request || isLoading) {
    return <RequestDetailsSkeleton />;
  }

  const currentStatusConfig = statusConfig[request.status];
  const nextStatusLabel = currentStatusConfig?.nextLabel;

  return (
    <View style={styles.container}>
      <RequestHeader
        request={request}
        nextStatusLabel={nextStatusLabel}
        onStatusChange={handleStatusChange}
        isActionBlocked={activeRequest?.id !== request.id}
      />

      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        extraKeyboardSpace={150}
        bottomOffset={150}
        keyboardShouldPersistTaps="handled"
      >
        {/* Applicant Info */}
        {(request.applicant || request.applicant_phone) && (
          <InfoSection title="Заявитель">
            {request.applicant && (
              <InfoRow
                icon="person-outline"
                text={request.applicant}
                weight={500}
              />
            )}
            {request.applicant_phone && (
              <InfoRow
                icon="call-outline"
                text={request.applicant_phone}
                onPress={() =>
                  Linking.openURL(`tel:${request.applicant_phone}`)
                }
              />
            )}
          </InfoSection>
        )}

        {/* Customer Info */}
        {(request.customer || request.customer_phone) && (
          <InfoSection title="Клиент">
            {request.customer && (
              <InfoRow
                icon="person-outline"
                text={request.customer}
                weight={500}
              />
            )}

            {request.customer_phone && (
              <InfoRow
                icon="call-outline"
                text={request.customer_phone}
                onPress={() => Linking.openURL(`tel:${request.customer_phone}`)}
              />
            )}
          </InfoSection>
        )}

        {/* Address */}
        <InfoSection title="Адрес">
          {/* Адрес дома + квартира */}
          <InfoRow
            icon="location-outline"
            text={
              request.house
                ? typeof request.house === 'string'
                  ? `${request.house}`
                  : `${request.house.full_address}${request.apartment ? `, кв. ${request.apartment}` : ''}`
                : request.apartment
                  ? `Кв. ${request.apartment}`
                  : 'Адрес не указан'
            }
          />

          {/* Подъезд / этаж */}
          {(request.entrance || request.floor) && (
            <InfoRow
              icon="business-outline"
              text={`${request.entrance ? `Подъезд ${request.entrance}` : ''}${
                request.entrance && request.floor ? ', ' : ''
              }${request.floor ? `Этаж ${request.floor}` : ''}`}
            />
          )}

          {/* Домофон: приоритет — у заявки, fallback — дом */}
          {(request.intercom_code ||
            (typeof request.house !== 'string' &&
              request.house?.intercom_code)) && (
            <InfoRow
              icon="keypad-outline"
              text={`Код домофона: ${
                request.intercom_code ||
                (typeof request.house !== 'string'
                  ? request.house?.intercom_code
                  : '')
              }`}
            />
          )}
        </InfoSection>

        {/* Organization */}
        {request.organization && (
          <InfoSection title="Организация">
            <InfoRow icon="business-outline" text={request.organization} />
          </InfoSection>
        )}

        {/* Problem Details */}
        <ProblemSection
          category={request.category || 'Категория не указана'}
          priority={request.priority}
          problem={request.problem || 'Проблема не указана'}
          problemCustomer={request.problem_customer || 'Не указана'}
        />

        {/* Work Done Section */}
        {request.work_done && (
          <InfoSection title="Выполненные работы">
            <GeistText weight={400} style={styles.workDoneText}>
              {request.work_done}
            </GeistText>
          </InfoSection>
        )}

        {/* Assigned Users */}
        {request.users && request.users.length > 0 && (
          <InfoSection title={`Исполнители (${request.users.length})`}>
            {request.users.map((user, index) => (
              <View key={index} style={index > 0 && styles.userRowBorder}>
                <InfoRow icon="person-outline" text={user} />
              </View>
            ))}
          </InfoSection>
        )}

        {/* Images Section */}
        <ImagesSection
          files={request.files}
          onAddFile={handleAddFile}
          onImagePress={handleImagePress}
        />

        {/* Notes Section */}
        <NotesSection
          note={request.note || ''}
          onNoteChange={handleNoteChange}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  workDoneText: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
  },
  userRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 8,
    paddingTop: 16,
  },
});

export default RequestDetailsPage;
