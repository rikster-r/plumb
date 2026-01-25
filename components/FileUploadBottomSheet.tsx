import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import BottomSheetKeyboardAwareScrollView from '@/components/BottomSheetKeyboardAwareScrollView';
import { BlurView } from 'expo-blur';
import { GeistText } from '@/components/GeistText';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';

interface FileUploadBottomSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  files: DocumentPicker.DocumentPickerAsset[];
  isUploading: boolean;
  onDismiss: () => void;
  onSubmit: () => void;
  onRemoveFile: (index: number) => void;
  onAddMoreFiles?: () => void;
}

const FileUploadBottomSheet: React.FC<FileUploadBottomSheetProps> = ({
  sheetRef,
  files,
  isUploading,
  onDismiss,
  onSubmit,
  onRemoveFile,
  onAddMoreFiles,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => sheetRef.current?.dismiss()}
        style={[StyleSheet.absoluteFill, props.style]}
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      </TouchableOpacity>
    ),
    [sheetRef],
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isOpen) {
          sheetRef.current?.dismiss();
          return true;
        }
        return false;
      };

      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => sub.remove();
    }, [isOpen, sheetRef]),
  );

  const handleSheetPositionChange = useCallback((position: number) => {
    setIsOpen(position === 0);
  }, []);

  const handleAddMoreFiles = () => {
    if (onAddMoreFiles) {
      onAddMoreFiles();
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={files.length > 5 ? ['90%'] : ['70%']}
      enablePanDownToClose
      enableDismissOnClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={onDismiss}
      onChange={handleSheetPositionChange}
    >
      {/* Fixed Header */}
      <View style={styles.header}>
        <GeistText style={styles.title} weight={600}>
          Выбранные файлы ({files.length})
        </GeistText>
        <TouchableOpacity onPress={() => sheetRef.current?.dismiss()}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Files List */}
      <BottomSheetKeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filesContainer}>
          {files.map((file, index) => {
            const extension =
              file.name.split('.').pop()?.toUpperCase() || 'FILE';
            const iconName = getFileIcon(file.name);

            return (
              <View key={`${file.name}-${index}`} style={styles.fileCard}>
                <View style={styles.fileIconContainer}>
                  <Ionicons name={iconName} size={24} color="#007AFF" />
                </View>

                <View style={styles.fileInfo}>
                  <GeistText weight={600} style={styles.fileName}>
                    {file.name}
                  </GeistText>
                  <GeistText weight={400} style={styles.fileFormat}>
                    {extension} • {((file.size ?? 0) / 1024 / 1024).toFixed(2)}{' '}
                    МБ
                  </GeistText>
                </View>

                {!isUploading && (
                  <TouchableOpacity
                    onPress={() => onRemoveFile(index)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {onAddMoreFiles && (
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={handleAddMoreFiles}
            disabled={isUploading}
          >
            <Ionicons
              name="add"
              size={20}
              color="#007AFF"
              style={styles.addMoreIcon}
            />
            <GeistText weight={600} style={styles.addMoreText}>
              Добавить еще
            </GeistText>
          </TouchableOpacity>
        )}
      </BottomSheetKeyboardAwareScrollView>

      {/* Fixed Footer with Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            if (!isUploading) {
              sheetRef.current?.dismiss();
            }
          }}
          disabled={isUploading}
        >
          <GeistText weight={600} style={styles.cancelButtonText}>
            Отмена
          </GeistText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            (isUploading || files.length === 0) && styles.submitButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={isUploading || files.length === 0}
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
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: '#ddd',
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  filesContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
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
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  addMoreIcon: {
    marginRight: 8,
  },
  addMoreText: {
    fontSize: 16,
    color: '#007AFF',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
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
  submitButtonDisabled: {
    backgroundColor: '#A1A1AA',
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default FileUploadBottomSheet;
