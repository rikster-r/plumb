import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import type { KeyedMutator } from 'swr';
import { statusConfig } from '../constants/requests';

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
        },
      );

      if (response.ok) {
        mutate({ ...request, status: currentStatus.nextStatus }, false);
      } else {
        const errorData = await response.json();
        Alert.alert(
          'Ошибка',
          errorData.message || 'Не удалось изменить статус',
        );
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  const handleAddFile = async (source: string) => {
    if (source === 'camera') {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Требуется разрешение',
          'Необходимо разрешение на использование камеры',
        );
        return;
      }

      try {
        const result = await ImagePicker.launchCameraAsync({
          quality: 0.8,
        });

        if (!result.canceled && result.assets) {
          await uploadFiles(result.assets);
        }
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось сделать фото');
      }
    } else if (source === 'gallery') {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Требуется разрешение',
          'Необходимо разрешение на доступ к галерее',
        );
        return;
      }

      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'image/*',
          copyToCacheDirectory: true,
          multiple: true,
        });

        if (!result.canceled && result.assets) {
          await uploadFiles(result.assets);
        }
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось выбрать файлы');
      }
    }
  };

  const uploadFiles = async (assets: any[]) => {
    try {
      const formData = new FormData();

      assets.forEach((asset) => {
        formData.append('files[]', {
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.name || `photo-${Date.now()}.jpg`,
        } as any);
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/requests/${requestId}/media`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        mutate();
        Alert.alert('Успешно', 'Фото добавлены');
      } else {
        const errorData = await response.json();
        Alert.alert(
          'Ошибка',
          errorData.message || 'Не удалось загрузить файлы',
        );
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить файлы');
    }
  };

  const handleNoteChange = async (newNote: string) => {
    if (!request) return;

    // Оптимистическое обновление
    mutate(
      { ...request, note: newNote.trim() },
      false,
    );

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
        },
      );

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      mutate();
    } catch (err) {
      console.error(err);
      // откатить оптимистическое обновление в случае ошибки
      mutate(request, false);
    }
  };

  return { handleStatusChange, handleAddFile, handleNoteChange };
}
