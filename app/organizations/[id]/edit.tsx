import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EditOrgInfo from '@/components/organizations/editOrganizationTabs/EditInfo';
import { EditOrgEmployees } from '@/components/organizations/editOrganizationTabs/EditEmployees';
import { EditOrgHouses } from '@/components/organizations/editOrganizationTabs/EditHouses';
import { EditTabs } from '@/components/ui/EditTabs';
import ItemDetailsHeader from '@/components/ui/ItemDetailsHeader';

const tabs = [
  { key: 'info', label: 'Инфо' },
  { key: 'employees', label: 'Сотрудники' },
  { key: 'houses', label: 'Дома' },
];

const OrganizationEditScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('info');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ItemDetailsHeader title="Редактировать организацию" />
      <EditTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <View style={styles.formContainer}>
        {activeTab === 'info' && <EditOrgInfo />}
        {activeTab === 'employees' && <EditOrgEmployees />}
        {activeTab === 'houses' && <EditOrgHouses />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  formContainer: {
    flex: 1,
  },
});

export default OrganizationEditScreen;
