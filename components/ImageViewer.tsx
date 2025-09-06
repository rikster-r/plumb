import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface File {
  id?: number | string;
  url?: string;
  uri?: string;
}

interface ImageViewerProps {
  visible: boolean;
  files: File[];
  selectedIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  files,
  selectedIndex,
  onClose,
  onIndexChange,
}) => {
  if (!files.length) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.imageViewerContainer}>
        <View style={styles.imageViewerHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <GeistText weight={500} style={styles.imageCounter}>
            {selectedIndex + 1} из {files.length}
          </GeistText>
        </View>

        <FlatList
          data={files}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={selectedIndex}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / screenWidth
            );
            onIndexChange(index);
          }}
          renderItem={({ item: file }) => (
            <View style={styles.imageViewerSlide}>
              <Image
                source={{ uri: file.url || file.uri }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </View>
          )}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageCounter: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  imageViewerSlide: {
    width: screenWidth,
    height: screenHeight - 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default ImageViewer;
