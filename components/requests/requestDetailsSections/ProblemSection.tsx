import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface ProblemSectionProps {
  category: string;
  priority: string;
  problem: string;
  problemCustomer?: string;
}

const ProblemSection: React.FC<ProblemSectionProps> = ({
  category,
  priority,
  problem,
  problemCustomer
}) => {
  const priorityColors = {
    Высокий: '#C21818',
    Средний: '#B47D00',
    Низкий: '#0A7E5E',
  };

  return (
    <View style={styles.section}>
      <GeistText weight={600} style={styles.sectionTitle}>
        Описание проблемы
      </GeistText>
      <View style={styles.card}>
        <View>
          <View style={styles.infoRow}>
            <Ionicons name="construct-outline" size={20} color="#52525B" />
            <GeistText weight={500} style={styles.infoText}>
              {category}
            </GeistText>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor: `${priorityColors[priority as keyof typeof priorityColors]}15`,
                  borderColor: `${priorityColors[priority as keyof typeof priorityColors]}30`,
                },
              ]}
            >
              <GeistText
                weight={500}
                style={[
                  styles.priorityText,
                  {
                    color: priorityColors[priority as keyof typeof priorityColors],
                  },
                ]}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </GeistText>
            </View>
          </View>
          <GeistText
            weight={400}
            style={[styles.problemDescription, { marginTop: 12 }]}
          >
            {problem}
          </GeistText>
          {problemCustomer && (
            <View style={styles.applicantWordsContainer}>
              <GeistText weight={500} style={styles.applicantWordsLabel}>
                Со слов заявителя:
              </GeistText>
              <GeistText weight={400} style={styles.applicantWordsText}>
                {problemCustomer}
              </GeistText>
            </View>
          )}
        </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 16,
    gap: 16,
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
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
  },
  problemDescription: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
    marginLeft: 32,
  },
  applicantWordsContainer: {
    marginTop: 12,
    marginLeft: 32,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
  },
  applicantWordsLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  applicantWordsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default ProblemSection;