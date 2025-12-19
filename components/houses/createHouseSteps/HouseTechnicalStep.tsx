// app/components/createHouseSteps/HouseTechnicalStep.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GeistText } from '@/components/GeistText';
import {
  FormSection,
  CheckboxField,
  LabeledInput,
  MultiSelectField,
  LabeledSwitch,
} from '@/components/formComponents';

interface Props {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  referenceData: any;
}

const HouseTechnicalStep = ({
  formData,
  updateFormData,
  errors,
  referenceData,
}: Props) => {
  const { other } = formData;
  const otherErrors = errors.other || {};

  const handleChange = (field: string, value: any) => {
    updateFormData('other', { [field]: value });
  };

  return (
    <View>
      <FormSection title="Особенности">
        <LabeledSwitch
          label="Шлагбаум"
          value={other.barrier}
          onValueChange={(value) => handleChange('barrier', value)}
        />
        {other.barrier && (
          <LabeledInput
            label="Примечание к шлагбауму"
            placeholder="Например: пульт у диспетчера, код 1234 и т.д."
            value={other.barrier_not}
            onChangeText={(text) => handleChange('barrier_not', text)}
            error={otherErrors.barrier_not}
            multiline
            numberOfLines={3}
          />
        )}
        {otherErrors.barrier && (
          <GeistText style={styles.errorText}>
            {otherErrors.barrier[0]}
          </GeistText>
        )}
        <LabeledSwitch
          label="Подвал"
          value={other.basement}
          onValueChange={(value) => handleChange('basement', value)}
        />
        {other.basement && (
          <LabeledInput
            label="Примечание к подвалу"
            placeholder="Ключи, доступ, особенности и т.д."
            value={other.basement_not}
            onChangeText={(text) => handleChange('basement_not', text)}
            error={otherErrors.basement_not}
            multiline
            numberOfLines={3}
          />
        )}
        {otherErrors.basement && (
          <GeistText style={styles.errorText}>
            {otherErrors.basement[0]}
          </GeistText>
        )}
        <LabeledSwitch
          label="Технический этаж"
          value={other.technical_floor}
          onValueChange={(value) => handleChange('technical_floor', value)}
        />
        {other.technical_floor && (
          <LabeledInput
            label="Примечание к тех. этажу"
            placeholder="Доступ, расположение, особенности"
            value={other.technical_floor_not}
            onChangeText={(text) => handleChange('technical_floor_not', text)}
            error={otherErrors.technical_floor_not}
            multiline
            numberOfLines={3}
          />
        )}
        {otherErrors.technical_floor && (
          <GeistText style={styles.errorText}>
            {otherErrors.technical_floor[0]}
          </GeistText>
        )}
      </FormSection>

      <FormSection title="Инженерные системы">
        <LabeledInput
          label="ВРУ"
          placeholder="Например: щитовая в подвале, №123"
          value={other.vru}
          onChangeText={(text) => handleChange('vru', text)}
          error={otherErrors.vru}
        />
        <LabeledInput
          label="ГВС (горячее водоснабжение)"
          placeholder="Расположение, особенности"
          value={other.dhw}
          onChangeText={(text) => handleChange('dhw', text)}
          error={otherErrors.dhw}
        />
        <LabeledInput
          label="ХВС (холодное водоснабжение)"
          placeholder="Расположение, особенности"
          value={other.cws}
          onChangeText={(text) => handleChange('cws', text)}
          error={otherErrors.cws}
        />
        <LabeledInput
          label="Отопление (ИТП/ЦТП)"
          placeholder="Тип, расположение"
          value={other.heating_unit}
          onChangeText={(text) => handleChange('heating_unit', text)}
          error={otherErrors.heating_unit}
        />
        <LabeledInput
          label="Насосное оборудование"
          placeholder="Повысительные насосы, пожарные и т.д."
          value={other.pump}
          onChangeText={(text) => handleChange('pump', text)}
          error={otherErrors.pump}
        />
      </FormSection>

      <FormSection title="Ресурсоснабжающие организации">
        <MultiSelectField
          label="Выберите РСО"
          options={referenceData.resourceOrganizations.map((org: any) => ({
            label: org.name,
            value: org.id.toString(),
          }))}
          selectedValues={other.resource_organizations}
          onValueChange={(values) =>
            handleChange('resource_organizations', values)
          }
          placeholder="Не выбраны"
          error={otherErrors.resource_organizations}
          loading={referenceData.loading.resourceOrganizations}
        />
      </FormSection>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
    marginTop: 6,
    marginLeft: 36, // отступ под чекбокс
    marginBottom: 8,
  },
});

export default HouseTechnicalStep;
