import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface BottomActionProps {
  nextStatus: string | null;
  nextStatusLabel: string | null;
  onStatusChange: () => void;
  isBlocked?: boolean;
}

const BottomAction: React.FC<BottomActionProps> = ({
  nextStatus,
  nextStatusLabel,
  onStatusChange,
  isBlocked = false,
}) => {
  if (!nextStatus || !nextStatusLabel) {
    return null;
  }

  return (
    <View style={styles.bottomAction}>
      <TouchableOpacity
        onPress={onStatusChange}
        disabled={isBlocked}
        style={[styles.actionButton, isBlocked && styles.actionButtonBlocked]}
        activeOpacity={0.7}
      >
        {isBlocked && <Ionicons name="ban-outline" size={20} color="#98A2B3" />}

        <GeistText
          weight={600}
          style={[
            styles.actionButtonText,
            isBlocked && styles.actionButtonTextBlocked,
          ]}
        >
          {nextStatusLabel}
        </GeistText>

        {!isBlocked && (
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        )}
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

  actionButtonBlocked: {
    backgroundColor: '#E4E7EC',
  },

  actionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  actionButtonTextBlocked: {
    color: '#98A2B3',
  },
});

export default BottomAction;
