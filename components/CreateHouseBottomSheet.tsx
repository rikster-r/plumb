import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from './BottomSheet';
import {
  LabeledInput,
  CheckboxField,
  FormRow,
  FormSection,
  FormActions,
} from './formComponents';

interface FormData {
  city: string;
  street: string;
  number: string;
  count_entrance: string;
  count_floor: string;
  count_apartment: string;
  square: string;
  intercom_code: string;
  key_location: string;
  maintenance_from: string;
  maintenance_to: string;
  lat: string;
  long: string;
  commercial: boolean;
  note: string;
}

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onCreate: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

const CreateHouseBottomSheet = ({
  bottomSheetRef,
  onCreate,
  onClose,
}: Props) => {
  const [formData, setFormData] = useState<FormData>({
    city: '',
    street: '',
    number: '',
    count_entrance: '',
    count_floor: '',
    count_apartment: '',
    square: '',
    intercom_code: '',
    key_location: '',
    maintenance_from: '09:00',
    maintenance_to: '18:00',
    lat: '',
    long: '',
    commercial: false,
    note: '',
  });

  const [isCreating, setIsCreating] = useState(false);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      city: '',
      street: '',
      number: '',
      count_entrance: '',
      count_floor: '',
      count_apartment: '',
      square: '',
      intercom_code: '',
      key_location: '',
      maintenance_from: '09:00',
      maintenance_to: '18:00',
      lat: '',
      long: '',
      commercial: false,
      note: '',
    });
  };

  const handleCreate = async () => {
    if (!formData.city || !formData.street || !formData.number) {
      alert('Заполните обязательные поля: город, улица, номер дома');
      return;
    }

    setIsCreating(true);
    try {
      await onCreate(formData);
      resetForm();
      onClose();
    } catch (err) {
      // Error handling done in parent
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
      title="Создать дом"
      snapPoints={['90%']}
      onDismiss={handleDismiss}
    >
      <View style={styles.formContainer}>

        <FormSection title="Обязательные поля">
          <LabeledInput
            label="Город *"
            value={formData.city}
            onChangeText={(t) => updateField('city', t)}
            placeholder="Воронеж"
          />
          <LabeledInput
            label="Улица *"
            value={formData.street}
            onChangeText={(t) => updateField('street', t)}
            placeholder="Острогожская"
          />
          <LabeledInput
            label="Номер дома *"
            value={formData.number}
            onChangeText={(t) => updateField('number', t)}
            placeholder="158/2"
          />
        </FormSection>

        <FormSection title="Характеристики здания">
          <FormRow>
            <LabeledInput
              label="Подъезды"
              value={formData.count_entrance}
              onChangeText={(t) => updateField('count_entrance', t)}
              keyboardType="numeric"
              placeholder="4"
            />
            <LabeledInput
              label="Этажи"
              value={formData.count_floor}
              onChangeText={(t) => updateField('count_floor', t)}
              keyboardType="numeric"
              placeholder="9"
            />
          </FormRow>

          <FormRow>
            <LabeledInput
              label="Квартиры"
              value={formData.count_apartment}
              onChangeText={(t) => updateField('count_apartment', t)}
              keyboardType="numeric"
              placeholder="72"
            />
            <LabeledInput
              label="Площадь (м²)"
              value={formData.square}
              onChangeText={(t) => updateField('square', t)}
              keyboardType="decimal-pad"
              placeholder="3240.50"
            />
          </FormRow>
        </FormSection>

        <FormSection title="Информация о доступе">
          <LabeledInput
            label="Код домофона"
            value={formData.intercom_code}
            onChangeText={(t) => updateField('intercom_code', t)}
            placeholder="1234"
          />
          <LabeledInput
            label="Местонахождение ключей"
            value={formData.key_location}
            onChangeText={(t) => updateField('key_location', t)}
            placeholder="У консьержа"
          />
        </FormSection>

        <FormSection title="График обслуживания">
          <FormRow>
            <LabeledInput
              label="С (ЧЧ:ММ)"
              value={formData.maintenance_from}
              onChangeText={(t) => updateField('maintenance_from', t)}
              placeholder="09:00"
            />
            <LabeledInput
              label="До (ЧЧ:ММ)"
              value={formData.maintenance_to}
              onChangeText={(t) => updateField('maintenance_to', t)}
              placeholder="18:00"
            />
          </FormRow>
        </FormSection>

        <FormSection title="Координаты">
          <FormRow>
            <LabeledInput
              label="Широта"
              value={formData.lat}
              onChangeText={(t) => updateField('lat', t)}
              keyboardType="decimal-pad"
              placeholder="51.6605"
            />
            <LabeledInput
              label="Долгота"
              value={formData.long}
              onChangeText={(t) => updateField('long', t)}
              keyboardType="decimal-pad"
              placeholder="39.2007"
            />
          </FormRow>
        </FormSection>

        <CheckboxField
          label="Коммерческая недвижимость"
          checked={formData.commercial}
          onToggle={() => updateField('commercial', !formData.commercial)}
        />

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
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
});

export default CreateHouseBottomSheet;