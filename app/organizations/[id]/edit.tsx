import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreventRemove } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

import { EditOrgEmployees } from '@/components/organizations/editOrganizationTabs/EditEmployees';
import { EditOrgHouses } from '@/components/organizations/editOrganizationTabs/EditHouses';
import EditOrgInfo from '@/components/organizations/editOrganizationTabs/EditInfo';
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigation = useNavigation();

  const confirmTabChange = (next: () => void) => {
    if (!hasUnsavedChanges) {
      next();
      return;
    }

    Alert.alert(
      'Несохранённые изменения',
      'На этой вкладке есть несохранённые изменения. Вы уверены, что хотите уйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Уйти',
          style: 'destructive',
          onPress: () => {
            setHasUnsavedChanges(false);
            next();
          },
        },
      ],
    );
  };

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert(
      'Несохранённые изменения',
      'У вас есть несохранённые изменения. Покинуть экран?',
      [
        { text: 'Отмена', style: 'cancel', onPress: () => {} },
        {
          text: 'Уйти',
          style: 'destructive',
          onPress: () => {
            setHasUnsavedChanges(false);
            navigation.dispatch(data.action);
          },
        },
      ],
    );
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ItemDetailsHeader title="Редактировать организацию" />
      <EditTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => confirmTabChange(() => setActiveTab(tab))}
      />

      {/* Content */}
      <View style={styles.formContainer}>
        {activeTab === 'info' && (
          <EditOrgInfo
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        )}
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
    backgroundColor: '#FFFFFF',
  },
});

export default OrganizationEditScreen;
