import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationTabs } from '@/components/formComponents';

import EditOrgInfo from '@/components/editOrganizationTabs/EditInfo';
import { EditOrgEmployees } from '@/components/editOrganizationTabs/EditEmployees';

const tabs = [
  { key: 'info', label: 'Инфо' },
  { key: 'employees', label: 'Сотрудники' },
  { key: 'houses', label: 'Дома' },
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
        {activeTab === 'info' && <EditOrgInfo />}
        {activeTab === 'employees' && <EditOrgEmployees />}
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
