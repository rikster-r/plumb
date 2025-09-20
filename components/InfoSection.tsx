import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress?: () => void;
  weight?: 400 | 500 | 600 | 700;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <GeistText weight={600} style={styles.sectionTitle}>
      {title}
    </GeistText>
    <View style={styles.card}>{children}</View>
  </View>
);

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  text,
  onPress,
  weight = 400,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={styles.infoRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.5 : undefined}
    >
      <Ionicons name={icon} size={20} color="#52525B" />
      <GeistText weight={weight} style={styles.infoText}>
        {text}
      </GeistText>
      {onPress && (
        <Ionicons name="chevron-forward-outline" size={20} color="#A1A1AA" />
      )}
    </Wrapper>
  );
};

export const EmptyCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}> = ({ icon, text }) => (
  <View style={styles.emptyCard}>
    <Ionicons name={icon} size={32} color="#A1A1AA" />
    <GeistText weight={400} style={styles.emptyText}>
      {text}
    </GeistText>
  </View>
);

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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 16,
    gap: 16,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#27272A',
    flex: 1,
  },
});

export default InfoSection;
