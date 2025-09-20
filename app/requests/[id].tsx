import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { GeistText } from '@/components/GeistText';
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';
import { statusConfig } from '../../constants/statusConfig';
import { useRequestActions } from '@/hooks/useRequestActions';

// Import components
import RequestHeader from '../../components/RequestHeader';
import { InfoSection, InfoRow } from '../../components/InfoSection';
import ProblemSection from '../../components/ProblemSection';
import ImagesSection from '../../components/ImagesSection';
import NotesSection from '../../components/NotesSection';
import TimelineSection from '../../components/TimelineSection';
import BottomAction from '../../components/BottomAction';
import RequestDetailsSkeleton from '@/components/RequestDetailsSkeleton';
import { formatDateTime } from '@/utils/dates';

const RequestDetailsPage = () => {
  const { id: requestId } = useLocalSearchParams();
  const { token } = useUser();

  const {
    data: request,
    isLoading,
    mutate,
  } = useSWRNative<Request>(
    [`${process.env.EXPO_PUBLIC_API_URL}/requests/${requestId}`, token],
    ([url, token]) => fetcherWithToken(url, token)
  );
  const { handleStatusChange, handleAddFile, handleAddNote } =
    useRequestActions({
      request,
      requestId: Number(requestId),
      token: token || '',
      mutate,
    });

  const [newNote, setNewNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    if (request) {
      setNewNote(request.note || '');
    }
  }, [request]);

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

  const handleEditNotePress = () => {
    setIsEditingNote(true);
  };

  const handleCancelNote = () => {
    setIsEditingNote(false);
    setNewNote(request?.note || '');
  };

  if (!request || isLoading) {
    return <RequestDetailsSkeleton />;
  }

  const currentStatusConfig = statusConfig[request.status];
  const nextStatus = currentStatusConfig?.nextStatus;
  const nextStatusLabel = currentStatusConfig?.nextLabel;

  return (
    <View style={styles.container}>
      <RequestHeader request={request} statusConfig={statusConfig} />

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
        <InfoSection title="Клиент">
          <InfoRow icon="person-outline" text={request.customer} weight={500} />

          <InfoRow
            icon="call-outline"
            text={request.customer_phone}
            onPress={() => Linking.openURL(`tel:${request.customer_phone}`)}
          />
        </InfoSection>

        {/* Address */}
        <InfoSection title="Адрес">
          <InfoRow
            icon="location-outline"
            text={`${request.house}${request.apartment ? `, кв. ${request.apartment}` : ''}`}
          />
          {(request.entrance || request.floor) && (
            <InfoRow
              icon="business-outline"
              text={`${request.entrance ? `Подъезд ${request.entrance}` : ''}${
                request.entrance && request.floor ? ', ' : ''
              }${request.floor ? `этаж ${request.floor}` : ''}`}
            />
          )}
          {request.intercom_code && (
            <InfoRow
              icon="keypad-outline"
              text={`Код домофона: ${request.intercom_code}`}
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
          category={request.category}
          priority={request.priority}
          problem={request.problem}
          problemCustomer={request.problem_customer}
        />

        {/* Work Done Section */}
        {request.work_done && (
          <InfoSection title="Выполненные работы">
            <GeistText weight={400} style={styles.workDoneText}>
              {request.work_done}
            </GeistText>
          </InfoSection>
        )}

        {/* Timeline */}
        <TimelineSection
          createdAt={request.created_at}
          existTime={request.exist_time}
          arrivalTime={request.arrival_time}
          completeTime={request.complete_time}
          formatDateTime={formatDateTime}
        />

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
          note={request.note}
          isEditing={isEditingNote}
          newNote={newNote}
          onEditPress={handleEditNotePress}
          onNoteChange={setNewNote}
          onSave={() => handleAddNote(newNote, setIsEditingNote)}
          onCancel={handleCancelNote}
        />
      </KeyboardAwareScrollView>

      {/* Bottom Action Button */}
      <BottomAction
        nextStatus={nextStatus}
        nextStatusLabel={nextStatusLabel}
        onStatusChange={handleStatusChange}
      />
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
