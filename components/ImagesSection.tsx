import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface ImagesSectionProps {
  files: File[];
  onAddFile: () => void;
  onImagePress: (index: number) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  files,
  onAddFile,
  onImagePress,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <GeistText weight={600} style={styles.sectionTitle}>
          Фото ({files.length})
        </GeistText>
        <TouchableOpacity onPress={onAddFile} style={styles.addButton}>
          <Ionicons name="add" size={20} color="#1F5EDB" />
          <GeistText weight={500} style={styles.addButtonText}>
            Добавить
          </GeistText>
        </TouchableOpacity>
      </View>
      {files.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {files.map((file, index) => (
            <TouchableOpacity
              activeOpacity={1}
              key={file.id || index}
              onPress={() => onImagePress(index)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: file.url || file.uri }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="image-outline" size={32} color="#A1A1AA" />
          <GeistText weight={400} style={styles.emptyText}>
            Фото не добавлены
          </GeistText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#09090B',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F5FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0E0FF',
  },
  addButtonText: {
    fontSize: 14,
    color: '#1F5EDB',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  imageScroll: {
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 6,
  },
});

export default ImagesSection;
