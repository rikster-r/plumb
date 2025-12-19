import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationTabs } from '@/components/formComponents';

import EditHouseInfo from '@/components/houses/editHouseTabs/EditInfo';
import EditExtra from '@/components/houses/editHouseTabs/EditExtra';
import EditHouseOrganization from '@/components/houses/editHouseTabs/EditOrganization'

const tabs = [
  { key: 'info', label: 'Инфо' },
  { key: 'oo', label: 'ОО' },
  { key: 'other', label: 'Прочее' },
  { key: 'files', label: 'Файлы' },
];

const HouseEditScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('info');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.tabsContainer}>
        <NavigationTabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {/* Render content based on activeTab */}
      <View style={styles.formContainer}>
        {activeTab === 'info' && <EditHouseInfo />}
        {activeTab === 'oo' && <EditHouseOrganization/>}
        {activeTab === 'other' && <EditExtra />}
        {activeTab === 'files' && <></>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  formContainer: {
    flex: 1,
    paddingTop: 8,
  },
});

export default HouseEditScreen;
