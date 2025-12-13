import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from './BottomSheet';
import { GeistText } from './GeistText';

import {
  LabeledInput,
  FormRow,
  FormSection,
  FormActions,
  BareInput,
} from './formComponents';

interface OrganizationFormData {
  name: string;
  full_name: string;
  address: string;
  phones: string[]; // массив телефонов
  schedule_id: string;
  time_from: string;
  time_end: string;
  start_cooperation: string;
  end_cooperation: string;
  branch_id: string;
  note: string;
}

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onCreate: (formData: OrganizationFormData) => Promise<void>;
  onClose: () => void;
}

const CreateOrganizationBottomSheet = ({
  bottomSheetRef,
  onCreate,
  onClose,
}: Props) => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    full_name: '',
    address: '',
    phones: [''], // начинаем с одного пустого поля
    schedule_id: '',
    time_from: '09:00',
    time_end: '18:00',
    start_cooperation: '',
    end_cooperation: '',
    branch_id: '',
    note: '',
  });

  const [isCreating, setIsCreating] = useState(false);

  const updateField = <K extends keyof OrganizationFormData>(
    key: K,
    value: OrganizationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    updateField('phones', newPhones);
  };

  const addPhone = () => {
    updateField('phones', [...formData.phones, '']);
  };

  const removePhone = (index: number) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      updateField('phones', newPhones);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      full_name: '',
      address: '',
      phones: [''],
      schedule_id: '',
      time_from: '09:00',
      time_end: '18:00',
      start_cooperation: '',
      end_cooperation: '',
      branch_id: '',
      note: '',
    });
  };

  const handleCreate = async () => {
    const filledPhones = formData.phones.filter((p) => p.trim().length > 0);

    if (
      !formData.name ||
      filledPhones.length === 0 ||
      !formData.schedule_id ||
      !formData.time_from ||
      !formData.time_end ||
      !formData.start_cooperation ||
      !formData.branch_id
    ) {
      alert('Заполните все обязательные поля');
      return;
    }

    setIsCreating(true);
    try {
      const payload: any = {
        ...formData,
        phones: filledPhones,
        schedule_id: parseInt(formData.schedule_id),
        branch_id: parseInt(formData.branch_id),
      };

      await onCreate(payload);
      resetForm();
      onClose();
    } catch (err) {
      // Обработка ошибки в родителе
    } finally {
      setIsCreating(false);
    }
  };

  const handleDismiss = () => {
    resetForm();
    onClose();
  };

  return (
    <BottomSheet
      sheetRef={bottomSheetRef}
      title="Создать организацию"
      snapPoints={['90%']}
      onDismiss={handleDismiss}
    >
      <View style={styles.formContainer}>
        <FormSection title="Основная информация">
          <LabeledInput
            label="Название *"
            value={formData.name}
            onChangeText={(t) => updateField('name', t)}
            placeholder="ООО УК ЖилСервис"
          />
          <LabeledInput
            label="Полное юридическое название"
            value={formData.full_name}
            onChangeText={(t) => updateField('full_name', t)}
            placeholder="Общество с ограниченной ответственностью..."
          />
          <LabeledInput
            label="Юридический адрес"
            value={formData.address}
            onChangeText={(t) => updateField('address', t)}
            placeholder="Москва, ул. Ленина, д. 1"
          />
        </FormSection>

        <FormSection title="Контакты">
          <GeistText weight={500} style={styles.label}>
            Телефоны *
          </GeistText>

          {formData.phones.map((phone, index) => (
            <View key={index} style={styles.phoneRow}>
              <BareInput
                value={phone}
                onChangeText={(t) => updatePhone(index, t)}
                placeholder="+7 (___) ___-__-__"
                keyboardType="phone-pad"
              />
              {formData.phones.length > 1 && (
                <TouchableOpacity
                  onPress={() => removePhone(index)}
                  style={styles.removePhoneButton}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addPhoneButton} onPress={addPhone}>
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <GeistText weight={500} style={styles.addPhoneText}>
              Добавить телефон
            </GeistText>
          </TouchableOpacity>
        </FormSection>

        <FormSection title="График и филиал">
          <FormRow>
            <LabeledInput
              label="ID графика *"
              value={formData.schedule_id}
              onChangeText={(t) => updateField('schedule_id', t)}
              keyboardType="numeric"
              placeholder="1"
            />
            <LabeledInput
              label="ID филиала *"
              value={formData.branch_id}
              onChangeText={(t) => updateField('branch_id', t)}
              keyboardType="numeric"
              placeholder="1"
            />
          </FormRow>

          <FormRow>
            <LabeledInput
              label="Время начала *"
              value={formData.time_from}
              onChangeText={(t) => updateField('time_from', t)}
              placeholder="09:00"
            />
            <LabeledInput
              label="Время окончания *"
              value={formData.time_end}
              onChangeText={(t) => updateField('time_end', t)}
              placeholder="18:00"
            />
          </FormRow>
        </FormSection>

        <FormSection title="Период сотрудничества">
          <FormRow>
            <LabeledInput
              label="Начало *"
              value={formData.start_cooperation}
              onChangeText={(t) => updateField('start_cooperation', t)}
              placeholder="01.01.2024"
            />
            <LabeledInput
              label="Окончание"
              value={formData.end_cooperation}
              onChangeText={(t) => updateField('end_cooperation', t)}
              placeholder="31.12.2026"
            />
          </FormRow>
        </FormSection>

        <FormSection title="Примечание">
          <LabeledInput
            label="Примечание"
            value={formData.note}
            onChangeText={(t) => updateField('note', t)}
            placeholder="Дополнительная информация..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </FormSection>

        <FormActions
          onCancel={handleDismiss}
          onSubmit={handleCreate}
          isSubmitting={isCreating}
          submitText="Создать"
          cancelText="Отмена"
        />

        <View style={{ height: 40 }} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 12,
  },
  removePhoneButton: {
    paddingBottom: 12, // выравнивание с инпутом
  },
  addPhoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addPhoneText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
});

export default CreateOrganizationBottomSheet;
