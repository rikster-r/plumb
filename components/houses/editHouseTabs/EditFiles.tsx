import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GeistText } from '@/components/GeistText';
import { useHouseDetails } from '@/hooks/useHouseDetails';
import { useUser } from '@/context/currentUser';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

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
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFiles, setNewFiles] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);

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

    const query = searchQuery.toLowerCase();
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(query) ||
        file.format.toLowerCase().includes(query),
    );
  }, [files, searchQuery]);

  const handleFileSelect = async () => {
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

      setNewFiles(result.assets);
      setModalVisible(true);
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать файл');
    }
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
      setModalVisible(false);
      setNewFiles([]);
      mutate();
    } catch (error) {
      console.error('Error uploading files:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить файлы');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFiles = async () => {
    if (selectedFiles.size === 0) return;

    Alert.alert(
      'Удалить файлы',
      `Удалить выбранные файлы (${selectedFiles.size})?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentFiles = house?.files || [];
              const indicesToDelete = Array.from(selectedFiles).map((id) =>
                parseInt(id.replace('file_', '')),
              );

              const updatedFiles = currentFiles.filter(
                (_, index) => !indicesToDelete.includes(index),
              );

              const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/houses/${id}/files`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    files: updatedFiles,
                  }),
                },
              );

              if (!response.ok) {
                throw new Error('Ошибка при удалении файлов');
              }

              Alert.alert('Успешно', 'Файлы удалены');
              setSelectedFiles(new Set());
              mutate();
            } catch (error) {
              console.error('Error deleting files:', error);
              Alert.alert('Ошибка', 'Не удалось удалить файлы');
            }
          },
        },
      ],
    );
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const removeFileFromModal = (index: number) => {
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
    const isSelected = selectedFiles.has(item.id);
    const iconName = getFileIcon(item.format);

    return (
      <TouchableOpacity
        style={[styles.fileCard, isSelected && styles.fileCardSelected]}
        onPress={() => toggleFileSelection(item.id)}
        activeOpacity={0.7}
      >
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

        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
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
      {/* Header Section with Search and Select Files */}
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
          onPress={handleFileSelect}
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

      {/* Delete Button (shown when files are selected) */}
      {selectedFiles.size > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteFiles}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <GeistText weight={600} style={styles.deleteButtonText}>
            Удалить ({selectedFiles.size})
          </GeistText>
        </TouchableOpacity>
      )}

      {/* File Upload Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          if (!isUploading) {
            setModalVisible(false);
            setNewFiles([]);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <GeistText weight={600} style={styles.modalTitle}>
                Выбранные файлы ({newFiles.length})
              </GeistText>
              <TouchableOpacity
                onPress={() => {
                  if (!isUploading) {
                    setModalVisible(false);
                    setNewFiles([]);
                  }
                }}
                disabled={isUploading}
              >
                <Ionicons name="close" size={28} color="#18181B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFileList}>
              {newFiles.map((file, index) => {
                const extension =
                  file.name.split('.').pop()?.toUpperCase() || 'FILE';
                const iconName = getFileIcon(extension);

                return (
                  <View key={index} style={styles.modalFileCard}>
                    <View style={styles.fileIconContainer}>
                      <Ionicons name={iconName} size={24} color="#007AFF" />
                    </View>

                    <View style={styles.fileInfo}>
                      <GeistText weight={600} style={styles.fileName}>
                        {file.name}
                      </GeistText>
                      <GeistText weight={400} style={styles.fileFormat}>
                        {extension} •{' '}
                        {((file.size ?? 0) / 1024 / 1024).toFixed(2)} МБ
                      </GeistText>
                    </View>

                    {!isUploading && (
                      <TouchableOpacity
                        onPress={() => removeFileFromModal(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  if (!isUploading) {
                    setModalVisible(false);
                    setNewFiles([]);
                  }
                }}
                disabled={isUploading}
              >
                <GeistText weight={600} style={styles.cancelButtonText}>
                  Отмена
                </GeistText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitFiles}
                disabled={isUploading || newFiles.length === 0}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <GeistText weight={600} style={styles.submitButtonText}>
                    Загрузить
                  </GeistText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 100,
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
  fileCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F7FF',
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
  deleteButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  modalTitle: {
    fontSize: 18,
    color: '#18181B',
  },
  modalFileList: {
    maxHeight: 400,
    padding: 20,
  },
  modalFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F4F4F5',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#18181B',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default EditHouseFiles;
