import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onUserPress?: () => void;
  showUserButton?: boolean;
}

export const RequestsPageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onUserPress,
  showUserButton = true,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <GeistText weight={700} style={styles.mainTitle}>
            {title}
          </GeistText>
          {subtitle && (
            <GeistText weight={400} style={styles.subtitle}>
              {subtitle}
            </GeistText>
          )}
        </View>

        {showUserButton && (
          <TouchableOpacity
            style={styles.userButton}
            onPress={onUserPress}
          >
            <Ionicons name="person-circle-outline" size={32} color="#52525B" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    color: '#09090B',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: '#52525B',
    marginTop: 4,
  },
  userButton: {
    padding: 4,
    borderRadius: 20,
  },
});