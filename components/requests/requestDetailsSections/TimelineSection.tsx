import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface TimelineItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  datetime: string;
}

interface TimelineSectionProps {
  createdAt: string;
  existTime?: string;
  arrivalTime?: string;
  completeTime?: string;
  formatDateTime: (dateTimeString: string) => { date: string; time: string };
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
  createdAt,
  existTime,
  arrivalTime,
  completeTime,
  formatDateTime,
}) => {
  const timelineItems: TimelineItem[] = [
    {
      icon: 'time-outline',
      label: 'Заявка принята',
      datetime: createdAt,
    },
    ...(existTime
      ? [
          {
            icon: 'car-outline' as keyof typeof Ionicons.glyphMap,
            label: 'Выезд',
            datetime: existTime,
          },
        ]
      : []),
    ...(arrivalTime
      ? [
          {
            icon: 'location-outline' as keyof typeof Ionicons.glyphMap,
            label: 'Прибытие',
            datetime: arrivalTime,
          },
        ]
      : []),
    ...(completeTime
      ? [
          {
            icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
            label: 'Заявка выполнена',
            datetime: completeTime,
          },
        ]
      : []),
  ];

  return (
    <View style={styles.section}>
      <GeistText weight={600} style={styles.sectionTitle}>
        Таймлайн
      </GeistText>
      <View style={styles.timelineContainer}>
        {timelineItems.map((item, index) => {
          const { date, time } = formatDateTime(item.datetime);
          const isLast = index === timelineItems.length - 1;

          return (
            <View key={index} style={styles.timelineItem}>
              {/* Left side with line and icon */}
              <View style={styles.markerContainer}>
                <View style={styles.line} />
                <View style={styles.iconWrapper}>
                  <Ionicons name={item.icon} size={18} color="#1F5EDB" />
                </View>
                {!isLast && <View style={[styles.line, { flex: 1 }]} />}
              </View>

              {/* Right side with text */}
              <View style={styles.textContainer}>
                <GeistText weight={500} style={styles.label}>
                  {item.label}
                </GeistText>
                <GeistText weight={400} style={styles.datetime}>
                  {date} в {time}
                </GeistText>
              </View>
            </View>
          );
        })}
      </View>
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
  timelineContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  markerContainer: {
    alignItems: 'center',
    width: 40,
  },
  line: {
    width: 2,
    backgroundColor: '#E4E4E7',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginVertical: 4,
  },
  textContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 2,
  },
  datetime: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default TimelineSection;
