import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreventRemove } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

import EditHouseInfo from '@/components/houses/editHouseTabs/EditInfo';
import EditExtra from '@/components/houses/editHouseTabs/EditExtra';
import EditHouseOrganization from '@/components/houses/editHouseTabs/EditOrganization';
import EditFiles from '@/components/houses/editHouseTabs/EditFiles';
import { EditTabs } from '@/components/ui/EditTabs';
import ItemDetailsHeader from '@/components/ui/ItemDetailsHeader';

const tabs = [
  { key: 'info', label: 'Инфо' },
  { key: 'oo', label: 'ОО' },
  { key: 'other', label: 'Прочее' },
  { key: 'files', label: 'Файлы' },
];

const HouseEditScreen = () => {
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
      <ItemDetailsHeader title="Редактировать дом" />
      <EditTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => confirmTabChange(() => setActiveTab(tab))}
      />

      {/* Render content based on activeTab */}
      <View style={styles.formContainer}>
        {activeTab === 'info' && (
          <EditHouseInfo
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        )}
        {activeTab === 'oo' && (
          <EditHouseOrganization
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        )}
        {activeTab === 'other' && (
          <EditExtra
            hasUnsavedChanges={hasUnsavedChanges}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        )}
        {activeTab === 'files' && <EditFiles />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default HouseEditScreen;
