import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Action = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
};

type BottomActionBarProps = {
  actions: Action[];
};

export const BottomActionBar = ({ actions }: BottomActionBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: 12 + insets.bottom }]}>
      {actions.map((action, index) => (
        <React.Fragment key={action.label}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={action.icon} size={24} color="#18181B" />
            <GeistText
              weight={500}
              style={[
                styles.text,
                action.destructive && styles.destructiveText,
              ]}
            >
              {action.label}
            </GeistText>
          </TouchableOpacity>

          {index < actions.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  text: {
    fontSize: 13,
    color: '#18181B',
    marginTop: 4,
  },
  destructiveText: {
    color: '#18181B',
  },
  divider: {
    width: 1,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 16,
  },
});

export default BottomActionBar;
