import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  LabeledInput,
  LabeledDropdown,
  FormRow,
  FormSection,
  LabeledSwitch,
} from '@/components/formComponents';
import { GeistText } from '@/components/GeistText';

interface HouseTariffStepProps {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  referenceData: any;
}

const HouseTariffStep = ({
  formData,
  updateFormData,
  errors,
  referenceData,
}: HouseTariffStepProps) => {
  const tariff = formData.info.houseTariff;
  const tariffErrors = errors.info?.houseTariff || {};

  const updateTariff = (field: string, value: any) => {
    updateFormData('info', {
      houseTariff: {
        ...tariff,
        [field]: value,
      },
    });
  };

  const branchOptions = referenceData.branches.map((branch: any) => ({
    label: branch.name,
    value: branch.id.toString(),
  }));

  const organizationOptions = referenceData.organizations.map((org: any) => ({
    label: org.name,
    value: org.id.toString(),
  }));

  return (
    <View>
      <FormSection title="Основная информация">
        <GeistText style={styles.infoText}>
          Выберите филиал и организацию, которые будут обслуживать этот дом
        </GeistText>

        <LabeledDropdown
          label="Филиал*"
          value={tariff.branch_id}
          onChangeValue={(value) => updateTariff('branch_id', value)}
          options={branchOptions}
          placeholder={
            referenceData.loading.branches ? 'Загрузка...' : 'Выберите филиал'
          }
          error={tariffErrors.branch_id?.[0]}
        />

        <LabeledDropdown
          label="Организация*"
          value={tariff.organization_id}
          onChangeValue={(value) => updateTariff('organization_id', value)}
          options={organizationOptions}
          placeholder={
            referenceData.loading.organizations
              ? 'Загрузка...'
              : 'Выберите организацию'
          }
          error={tariffErrors.organization_id?.[0]}
        />
      </FormSection>

      <FormSection title="Период обслуживания">
        <GeistText style={styles.infoText}>
          Укажите период действия договора обслуживания (необязательно)
        </GeistText>

        <FormRow>
          <LabeledInput
            label="Дата начала"
            value={tariff.date_maintenance_from}
            onChangeText={(t) => updateTariff('date_maintenance_from', t)}
            placeholder="2024-01-01"
          />
          <LabeledInput
            label="Дата окончания"
            value={tariff.date_maintenance_to}
            onChangeText={(t) => updateTariff('date_maintenance_to', t)}
            placeholder="2024-12-31"
          />
        </FormRow>
      </FormSection>

      <FormSection title="Тариф">
        <LabeledSwitch
          label="Фиксированная стоимость"
          value={tariff.rate}
          onValueChange={(value) => updateTariff('rate', value)}
        />

        {tariff.rate && (
          <View style={styles.tariffAmountContainer}>
            <LabeledInput
              label="Сумма тарифа (₽)"
              value={tariff.sum_rate}
              onChangeText={(t) => updateTariff('sum_rate', t)}
              placeholder="25.75"
              keyboardType="decimal-pad"
            />
            <GeistText style={styles.helpText}>
              Укажите стоимость обслуживания в рублях
            </GeistText>
          </View>
        )}
      </FormSection>
    </View>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  tariffAmountContainer: {
    marginTop: 12,
  },
  helpText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
});

export default HouseTariffStep;
