import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, View, Dimensions, StyleSheet } from 'react-native';
import { GeistText } from '@/components/GeistText';

interface StatusTabsProps {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const StatusTabs: React.FC<StatusTabsProps> = ({ tabs, selected, onSelect }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTab = (index: number) => {
    if (scrollViewRef.current) {
      const tabWidth = 60 + 14 * 2; // minWidth + padding
      const tabMargin = 12;
      const totalTabWidth = tabWidth + tabMargin;
      const tabCenter = 24 + index * totalTabWidth + tabWidth / 2;
      const scrollPosition = Math.max(0, tabCenter - screenWidth / 2);

      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  const handlePress = (tab: string, index: number) => {
    onSelect(tab);
    scrollToTab(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ flexDirection: 'row' }}>
          {tabs.map((tab, index) => {
            const isActive = selected === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => handlePress(tab, index)}
                style={[
                  styles.tab,
                  isActive ? styles.activeTab : styles.inactiveTab,
                  { marginRight: 12 },
                ]}
              >
                <GeistText
                  weight={500}
                  style={[
                    styles.tabText,
                    isActive ? styles.activeTabText : styles.inactiveTabText,
                  ]}
                >
                  {tab}
                </GeistText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#F0F5FF',
    borderColor: '#D0E0FF',
  },
  inactiveTab: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E4E4E7',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: '#1F5EDB',
  },
  inactiveTabText: {
    color: '#71717A',
  },
});
