import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import type { KeyedMutator } from 'swr';
import { statusConfig } from '../constants/statusConfig';

type Props = {
  request: Request | undefined;
  requestId: number;
  token: string;
  mutate: KeyedMutator<Request>;
};

export function useRequestActions({
  request,
  requestId,
  token,
  mutate,
}: Props) {
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

  const handleAddNote = async (newNote: string, setIsEditingNote: Function) => {
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
          Alert.alert('Ошибка', errorData.message || 'Не удалось сохранить');
        }
      } catch {
        Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
      }
    }
  };

  return { handleStatusChange, handleAddFile, handleAddNote };
}
