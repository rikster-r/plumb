import React from 'react';
import { View } from 'react-native';
import {
  LabeledInput,
  LabeledDropdown,
  FormRow,
  FormSection,
  LabeledSwitch,
} from '@/components/formComponents';

interface HouseInfoStepProps {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  referenceData: any;
}

const HouseInfoStep = ({ formData, updateFormData, errors, referenceData }: HouseInfoStepProps) => {
  const info = formData.info;
  const infoErrors = errors.info || {};

  const updateInfo = (field: string, value: any) => {
    updateFormData('info', { [field]: value });
  };

  const addressTypeOptions = referenceData.addressTypes.map((type: any) => ({
    label: type.name,
    value: type.id.toString(),
  }));

  return (
    <View>
      <FormSection title="Адрес">
        <LabeledInput
          label="Город*"
          value={info.city}
          onChangeText={(t) => updateInfo('city', t)}
          placeholder="Москва"
          error={infoErrors.city?.[0]}
        />
        
        <FormRow>
          <LabeledInput
            label="Регион"
            value={info.region}
            onChangeText={(t) => updateInfo('region', t)}
            placeholder="Московская обл."
          />
          <LabeledInput
            label="Район"
            value={info.area}
            onChangeText={(t) => updateInfo('area', t)}
            placeholder="Левобережный"
          />
        </FormRow>

        <LabeledInput
          label="Жилой комплекс"
          value={info.complex}
          onChangeText={(t) => updateInfo('complex', t)}
          placeholder="Северный парк"
        />

        <LabeledInput
          label="Улица*"
          value={info.street}
          onChangeText={(t) => updateInfo('street', t)}
          placeholder="Сибиряковская"
          error={infoErrors.street?.[0]}
        />

        <FormRow>
          <LabeledInput
            label="Номер дома*"
            value={info.number}
            onChangeText={(t) => updateInfo('number', t)}
            placeholder="5"
            error={infoErrors.number?.[0]}
          />
          <LabeledInput
            label="Корпус"
            value={info.frame}
            onChangeText={(t) => updateInfo('frame', t)}
            placeholder="А"
          />
        </FormRow>

        <LabeledInput
          label="Строение"
          value={info.building}
          onChangeText={(t) => updateInfo('building', t)}
          placeholder="1"
        />
      </FormSection>

      <FormSection title="Характеристики здания">
        <FormRow>
          <LabeledInput
            label="Подъезд"
            value={info.count_entrance}
            onChangeText={(t) => updateInfo('count_entrance', t)}
            placeholder="6"
            keyboardType="numeric"
          />
          <LabeledInput
            label="Этаж"
            value={info.count_floor}
            onChangeText={(t) => updateInfo('count_floor', t)}
            placeholder="16"
            keyboardType="numeric"
          />
        </FormRow>

        <FormRow>
          <LabeledInput
            label="Квартира"
            value={info.count_apartment}
            onChangeText={(t) => updateInfo('count_apartment', t)}
            placeholder="96"
            keyboardType="numeric"
          />
          <LabeledInput
            label="Площадь (м²)"
            value={info.square}
            onChangeText={(t) => updateInfo('square', t)}
            placeholder="4500.50"
            keyboardType="decimal-pad"
          />
        </FormRow>
      </FormSection>

      <FormSection title="Доступ">
        <LabeledInput
          label="Код домофона"
          value={info.intercom_code}
          onChangeText={(t) => updateInfo('intercom_code', t)}
          placeholder="148K"
        />

        <LabeledInput
          label="Место хранения ключей"
          value={info.key_location}
          onChangeText={(t) => updateInfo('key_location', t)}
          placeholder="Консьерж"
        />
      </FormSection>

      <FormSection title="График обслуживания">
        <FormRow>
          <LabeledInput
            label="Время начала*"
            value={info.maintenance_from}
            onChangeText={(t) => updateInfo('maintenance_from', t)}
            placeholder="09:00"
            error={infoErrors.maintenance_from?.[0]}
          />
          <LabeledInput
            label="Время окончания*"
            value={info.maintenance_to}
            onChangeText={(t) => updateInfo('maintenance_to', t)}
            placeholder="18:00"
            error={infoErrors.maintenance_to?.[0]}
          />
        </FormRow>
      </FormSection>

      <FormSection title="Классификация">
        <LabeledDropdown
          label="Тип адреса*"
          value={info.address_type_id}
          onChangeValue={(value) => updateInfo('address_type_id', value)}
          options={addressTypeOptions}
          placeholder={
            referenceData.loading.addressTypes ? 'Загрузка...' : 'Выберите тип'
          }
          error={infoErrors.address_type_id?.[0]}
        />

        <LabeledSwitch
          label="Коммерческая недвижимость"
          value={info.commercial}
          onValueChange={(value) => updateInfo('commercial', value)}
        />
      </FormSection>

      <FormSection title="Примечание">
        <LabeledInput
          label="Дополнительная информация"
          value={info.note}
          onChangeText={(t) => updateInfo('note', t)}
          placeholder="Дом с улучшенной планировкой..."
          multiline
          numberOfLines={4}
        />
      </FormSection>
    </View>
  );
};

export default HouseInfoStep;