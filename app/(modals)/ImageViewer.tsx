import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ImageViewer() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { files: filesParam, selectedIndex: selectedIndexParam } =
    useLocalSearchParams<{
      files: string;
      selectedIndex: string;
    }>();

  const files: File[] = JSON.parse(filesParam || '[]');
  const initialIndex = Number(selectedIndexParam || 0);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!files.length) return null;

  return (
    <View style={styles.imageViewerContainer}>
      {/* Header with safe area padding */}
      <View
        style={[
          styles.imageViewerHeader,
          { paddingTop: insets.top + 12, paddingHorizontal: 20 },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <GeistText weight={500} style={styles.imageCounter}>
          {currentIndex + 1} из {files.length}
        </GeistText>
      </View>

      <FlatList
        data={files}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item: file }) => (
          <View
            style={[
              styles.imageViewerSlide,
              { paddingBottom: insets.bottom }, // prevents content from being cut by gesture bar
            ]}
          >
            <Image
              source={{ uri: file.url || file.uri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    // padding handled dynamically with insets
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
