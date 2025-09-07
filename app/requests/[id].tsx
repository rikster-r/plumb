import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

// Import components
import RequestHeader from '../../components/RequestHeader';
import { InfoSection, InfoRow } from '../../components/InfoSection';
import ProblemSection from '../../components/ProblemSection';
import ImagesSection from '../../components/ImagesSection';
import NotesSection from '../../components/NotesSection';
import TimelineSection from '../../components/TimelineSection';
import BottomAction from '../../components/BottomAction';
import RequestDetailsSkeleton from '@/components/RequestDetailsSkeleton';

const statusConfig: Record<
  string,
  {
    color: string;
    backgroundColor: string;
    borderColor: string;
    icon: keyof typeof Ionicons.glyphMap;
    sentAPIStatus?: string | null;
    nextStatus: string | null;
    nextLabel: string | null;
  }
> = {
  Принята: {
    color: '#1F5EDB',
    backgroundColor: '#F0F5FF',
    borderColor: '#D0E0FF',
    icon: 'alert-circle-outline',
    sentAPIStatus: 'В пути',
    nextStatus: 'В пути',
    nextLabel: 'Выехать',
  },
  'В пути': {
    color: '#B47D00',
    backgroundColor: '#FFF8E6',
    borderColor: '#FFECB3',
    icon: 'car-outline',
    sentAPIStatus: 'В работе',
    nextStatus: 'На исполнении',
    nextLabel: 'Начать работу',
  },
  'На исполнении': {
    color: '#0A7E5E',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: 'construct-outline',
    sentAPIStatus: 'Завершена',
    nextStatus: 'Выполнена',
    nextLabel: 'Завершить',
  },
  Выполнена: {
    color: '#4B5563',
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    icon: 'checkmark-circle-outline',
    sentAPIStatus: null,
    nextStatus: null,
    nextLabel: null,
  },
  Закрыта: {
    color: '#71717A',
    backgroundColor: '#F4F4F5',
    borderColor: '#E4E4E7',
    icon: 'lock-closed-outline',
    sentAPIStatus: null,
    nextStatus: null,
    nextLabel: null,
  },
};

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

  const [newNote, setNewNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    if (request) {
      setNewNote(request.note || '');
    }
  }, [request]);

  const parseDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return null;
    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('.');
    return new Date(`${year}-${month}-${day}T${timePart}:00`);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = parseDateTime(dateTimeString);
    if (!date) return { date: '', time: '' };

    return {
      date: date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const handleStatusChange = async () => {
    if (!request) return;
    const currentStatus = statusConfig[request.status];
    if (!currentStatus?.nextStatus) return;

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/requests/${requestId}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: currentStatus.sentAPIStatus }),
        }
      );

      if (response.ok) {
        mutate({ ...request, status: currentStatus.nextStatus }, false);
      } else {
        const errorData = await response.json();
        Alert.alert(
          'Ошибка',
          errorData.message || 'Не удалось изменить статус'
        );
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const formData = new FormData();

        result.assets.forEach((asset) => {
          formData.append('files[]', {
            uri: asset.uri,
            type: asset.mimeType || 'image/jpeg',
            name: asset.name || `file-${Date.now()}.jpg`,
          } as any);
        });

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/requests/${requestId}/media`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          }
        );

        if (response.ok) {
          mutate();
        } else {
          const errorData = await response.json();
          Alert.alert(
            'Ошибка',
            errorData.message || 'Не удалось добавить файлы'
          );
        }
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить файлы');
    }
  };

  const handleAddNote = async () => {
    if (!request) return;

    if (newNote.trim()) {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/requests/${requestId}/comment`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: newNote.trim() }),
          }
        );

        if (response.ok) {
          mutate({ ...request, note: newNote.trim() }, false);
          setIsEditingNote(false);
          Alert.alert('Успешно', 'Примечание сохранено');
        } else {
          const errorData = await response.json();
          Alert.alert(
            'Ошибка',
            errorData.message || 'Не удалось сохранить примечание'
          );
        }
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
      }
    }
  };

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
              <InfoRow icon="call-outline" text={request.applicant_phone} />
            )}
          </InfoSection>
        )}

        {/* Customer Info */}
        <InfoSection title="Клиент">
          <InfoRow icon="person-outline" text={request.customer} weight={500} />
          <InfoRow icon="call-outline" text={request.customer_phone} />
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
          onSave={handleAddNote}
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
