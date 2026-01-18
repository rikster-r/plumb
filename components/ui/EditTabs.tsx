import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type EditTab = {
  key: string;
  label: string;
};

interface EditTabsProps {
  tabs: EditTab[];
  activeTab: string;
  onChange: (key: string) => void;
}

export const EditTabs = ({ tabs, activeTab, onChange }: EditTabsProps) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  label: {
    fontSize: 15,
    fontWeight: '400',
    color: '#9a9a9a',
  },
  labelActive: {
    fontWeight: '600',
    color: '#007AFF',
  },
});
