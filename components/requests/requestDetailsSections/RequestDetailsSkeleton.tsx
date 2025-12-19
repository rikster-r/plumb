import React from 'react';
import { View, StyleSheet } from 'react-native';

const RequestDetailsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.skeletonSmall} />
            <View style={styles.statusBadge}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonMedium} />
            </View>
          </View>
        </View>
      </View>

      {/* Content Skeleton */}
      <View style={styles.content}>
        {/* Section 1 */}
        <View style={styles.section}>
          <View style={styles.skeletonTitle} />
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText} />
            </View>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText} />
            </View>
          </View>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <View style={styles.skeletonTitle} />
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText} />
            </View>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText} />
            </View>
          </View>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <View style={styles.skeletonTitle} />
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText} />
            </View>
            <View style={styles.row}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonTextShort} />
            </View>
          </View>
        </View>

        {/* Problem Section */}
        <View style={styles.section}>
          <View style={styles.skeletonTitle} />
          <View style={styles.card}>
            <View style={styles.skeletonTextBlock} />
            <View style={styles.skeletonTextBlock} />
            <View style={styles.skeletonTextShort} />
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <View style={styles.skeletonTitle} />
          <View style={styles.card}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <View style={styles.skeletonText} />
                  <View style={styles.skeletonSmall} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <View style={styles.skeletonTitle} />
          <View style={styles.card}>
            <View style={styles.imageGrid}>
              <View style={styles.imageSkeleton} />
              <View style={styles.imageSkeleton} />
              <View style={styles.imageSkeleton} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E4E4E7',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    backgroundColor: '#E4E4E7',
    borderRadius: 6,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    gap: 4,
  },
  imageGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  imageSkeleton: {
    width: 80,
    height: 80,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
  },
  // Skeleton elements
  skeletonIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#E4E4E7',
    borderRadius: 10,
  },
  skeletonSmall: {
    width: 140,
    height: 16,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
  },
  skeletonMedium: {
    width: 80,
    height: 16,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
  },
  skeletonLarge: {
    width: '90%',
    height: 20,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonTitle: {
    width: 120,
    height: 22,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonText: {
    flex: 1,
    height: 18,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
  },
  skeletonTextShort: {
    width: '60%',
    height: 18,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
  },
  skeletonTextBlock: {
    width: '100%',
    height: 18,
    backgroundColor: '#E4E4E7',
    borderRadius: 8,
  },
});

export default RequestDetailsSkeleton;
