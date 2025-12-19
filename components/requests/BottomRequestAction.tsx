import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface BottomActionProps {
  nextStatus: string | null;
  nextStatusLabel: string | null;
  onStatusChange: () => void;
}

const BottomAction: React.FC<BottomActionProps> = ({
  nextStatus,
  nextStatusLabel,
  onStatusChange
}) => {
  if (!nextStatus || !nextStatusLabel) {
    return null;
  }

  return (
    <View style={styles.bottomAction}>
      <TouchableOpacity
        onPress={onStatusChange}
        style={styles.actionButton}
      >
        <GeistText weight={600} style={styles.actionButtonText}>
          {nextStatusLabel}
        </GeistText>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  actionButton: {
    backgroundColor: '#1F5EDB',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default BottomAction;