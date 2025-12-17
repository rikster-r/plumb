import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { GeistText } from '../GeistText';

type Tab = {
  key: string;
  label: string;
};

type Props = {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
};

const PRIMARY = '#007AFF';

const NavTabs = ({ tabs, activeKey, onChange }: Props) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.7}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <GeistText
              weight={600}
              style={[styles.label, isActive && styles.labelActive]}
            >
              {tab.label}
            </GeistText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F2F2F7',
  },
  tabActive: {
    backgroundColor: PRIMARY + '1A', // subtle blue bg
  },
  label: {
    fontSize: 14,
    color: '#000000',
  },
  labelActive: {
    color: PRIMARY,
  },
});

export default NavTabs;
