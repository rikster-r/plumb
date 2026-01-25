import FileUploadBottomSheet from '@/components/FileUploadBottomSheet';
import { GeistText } from '@/components/GeistText';
import { useUser } from '@/context/currentUser';
import { useHouseDetails } from '@/hooks/useHouseDetails';
import { Ionicons } from '@expo/vector-icons';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface HouseFile {
  name: string;
  url: string;
  format: string;
}

interface FileItem extends HouseFile {
  id: string;
}

const EditHouseFiles = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useUser();
  const { house, isLoading, mutate } = useHouseDetails(id);

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newFiles, setNewFiles] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Convert house files to FileItem format with unique IDs
  const files: FileItem[] = useMemo(() => {
    if (!house?.files || house.files.length === 0) return [];

    return house.files.map((file, index) => ({
      ...file,
      id: `file_${index}`,
    }));
  }, [house?.files]);

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;

    const query = searchQuery.toLowerCase().trim();
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(query) ||
        file.format.toLowerCase().includes(query),
    );
  }, [files, searchQuery]);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Доступ к камере отклонен',
        'Для съемки фото необходимо предоставить доступ к камере в настройках приложения.',
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images', 'videos'],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (asset) {
        const fileAsset: DocumentPicker.DocumentPickerAsset = {
          uri: asset.uri,
          name: `photo_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          size: asset.fileSize || 0,
          lastModified: Date.now(),
        };

        setNewFiles((files) => [...files, fileAsset]);
        bottomSheetRef.current?.present();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'text/plain',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'video/mp4',
          'video/x-msvideo',
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setNewFiles((files) => [...files, ...result.assets]);
      bottomSheetRef.current?.present();
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать файл');
    }
  };

  const handleAddFile = async () => {
    Alert.alert(
      'Выберите источник',
      'Откуда вы хотите добавить файл?',
      [
        {
          text: 'Сделать фото',
          onPress: takePhoto,
          style: 'default',
        },
        {
          text: 'Выбрать файл',
          onPress: pickDocuments,
          style: 'default',
        },
      ],
      { cancelable: true },
    );
  };

  const handleAddMoreFiles = async () => {
    Alert.alert(
      'Выберите источник',
      'Откуда вы хотите добавить файлы?',
      [
        {
          text: 'Сделать фото',
          onPress: takePhoto,
          style: 'default',
        },
        {
          text: 'Выбрать файлы',
          onPress: pickDocuments,
          style: 'default',
        },
      ],
      { cancelable: true },
    );
  };

  const handleSubmitFiles = async () => {
    if (newFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();

      newFiles.forEach((file) => {
        formData.append('files[]', {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name,
        } as any);
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/houses/${id}/files`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          Alert.alert('Ошибка валидации', errorMessages);
        } else {
          throw new Error(data.message || 'Ошибка при загрузке файлов');
        }
        return;
      }

      Alert.alert('Успешно', 'Файлы загружены');
      bottomSheetRef.current?.dismiss();
      setNewFiles([]);
      mutate();
    } catch (error) {
      console.error('Error uploading files:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить файлы');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    if (newFiles.length === 0) return;
    if (newFiles.length === 1 && index === 0) {
      bottomSheetRef.current?.dismiss();
    }
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (format: string) => {
    const ext = format.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return 'image-outline';
    }
    if (ext === 'pdf') {
      return 'document-text-outline';
    }
    if (['doc', 'docx'].includes(ext)) {
      return 'document-outline';
    }
    if (['xls', 'xlsx'].includes(ext)) {
      return 'grid-outline';
    }
    if (['mp4', 'avi', 'mov'].includes(ext)) {
      return 'videocam-outline';
    }
    return 'document-outline';
  };

  const renderFileItem = ({ item }: { item: FileItem }) => {
    const iconName = getFileIcon(item.format);

    return (
      <View style={styles.fileCard}>
        <View style={styles.fileIconContainer}>
          <Ionicons name={iconName} size={24} color="#007AFF" />
        </View>

        <View style={styles.fileInfo}>
          <GeistText weight={600} style={styles.fileName}>
            {item.name}
          </GeistText>
          <GeistText weight={400} style={styles.fileFormat}>
            {item.format.toUpperCase()}
          </GeistText>
        </View>
      </View>
    );
  };

  const handleDismissBottomSheet = () => {
    if (!isUploading) {
      setNewFiles([]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#18181B" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section with Search */}
      <View style={styles.headerSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#71717A"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A1A1AA"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#71717A" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFile}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Uploaded Files List */}
      <View style={styles.uploadedSection}>
        <GeistText weight={600} style={styles.sectionTitle}>
          Загруженные файлы
        </GeistText>

        <FlatList
          data={filteredFiles}
          keyExtractor={(item) => item.id}
          renderItem={renderFileItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color="#D4D4D8" />
              <GeistText weight={600} style={styles.emptyText}>
                Отсутствуют данные
              </GeistText>
              <GeistText weight={400} style={styles.emptySubtext}>
                Записей на странице: 0-0 из 0
              </GeistText>
            </View>
          }
        />
      </View>

      <FileUploadBottomSheet
        sheetRef={bottomSheetRef}
        files={newFiles}
        isUploading={isUploading}
        onDismiss={handleDismissBottomSheet}
        onSubmit={handleSubmitFiles}
        onRemoveFile={removeFile}
        onAddMoreFiles={handleAddMoreFiles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: 100,
    height: 44,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#18181B',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadedSection: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#18181B',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    color: '#18181B',
    marginBottom: 4,
  },
  fileFormat: {
    fontSize: 14,
    color: '#71717A',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#18181B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 4,
  },
});

export default EditHouseFiles;
