import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  LabeledInput,
  LabeledDropdown,
  FormSection,
  BareInput,
} from '@/components/formComponents';
import { GeistText } from '@/components/GeistText';

interface HouseOrganizationStepProps {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  referenceData: any;
}

const HouseOrganizationStep = ({ formData, updateFormData, errors, referenceData }: HouseOrganizationStepProps) => {
  const organization = formData.organization;
  const orgErrors = errors.organization || {};

  const updateOrganization = (field: string, value: any) => {
    updateFormData('organization', { [field]: value });
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...organization.phones];
    newPhones[index] = value;
    updateOrganization('phones', newPhones);
  };

  const addPhone = () => {
    updateOrganization('phones', [...organization.phones, '']);
  };

  const removePhone = (index: number) => {
    if (organization.phones.length > 1) {
      const newPhones = organization.phones.filter((_: any, i: number) => i !== index);
      updateOrganization('phones', newPhones);
    }
  };

  const toggleEmployee = (employeeId: string) => {
    const currentEmployees = organization.employees || [];
    const index = currentEmployees.indexOf(employeeId);
    
    if (index === -1) {
      updateOrganization('employees', [...currentEmployees, employeeId]);
    } else {
      updateOrganization('employees', currentEmployees.filter((id: string) => id !== employeeId));
    }
  };

  const scheduleOptions = referenceData.schedules.map((schedule: any) => ({
    label: `${schedule.working}/${schedule.day_off} (${schedule.start_time}-${schedule.end_time})`,
    value: schedule.id.toString(),
  }));

  return (
    <View>
      <FormSection title="Адрес организации">
        <GeistText style={styles.infoText}>
          Юридический адрес обслуживающей организации
        </GeistText>
        <LabeledInput
          label="Адрес"
          value={organization.address}
          onChangeText={(t) => updateOrganization('address', t)}
          placeholder="г. Москва, ул. Центральная, д. 1"
        />
      </FormSection>

      <FormSection title="Контактные телефоны">
        <GeistText
          weight={500}
          style={[styles.label, orgErrors.phones && styles.labelError]}
        >
          Телефоны*
        </GeistText>
        <GeistText style={styles.helpText}>
          Укажите контактные телефоны организации
        </GeistText>
        
        <View style={{ gap: 12, marginTop: 12 }}>
          {organization.phones.map((phone: string, index: number) => (
            <View key={index} style={styles.phoneRow}>
              <View style={{ flex: 1 }}>
                <BareInput
                  value={phone}
                  onChangeText={(t) => updatePhone(index, t)}
                  placeholder="+7 (___) ___-__-__"
                  keyboardType="phone-pad"
                  style={orgErrors.phones ? styles.inputError : undefined}
                />
              </View>
              {organization.phones.length > 1 && (
                <TouchableOpacity
                  onPress={() => removePhone(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {orgErrors.phones && (
          <GeistText style={styles.errorText}>{orgErrors.phones[0]}</GeistText>
        )}

        <TouchableOpacity style={styles.addButton} onPress={addPhone}>
          <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
          <GeistText weight={500} style={styles.addButtonText}>
            Добавить телефон
          </GeistText>
        </TouchableOpacity>
      </FormSection>

      <FormSection title="График работы">
        <LabeledDropdown
          label="График*"
          value={organization.schedule_id}
          onChangeValue={(value) => updateOrganization('schedule_id', value)}
          options={scheduleOptions}
          placeholder={
            referenceData.loading.schedules ? 'Загрузка...' : 'Выберите график'
          }
          error={orgErrors.schedule_id?.[0]}
        />
      </FormSection>

      <FormSection title="Сотрудники">
        <GeistText weight={500} style={styles.label}>
          Назначенные сотрудники
        </GeistText>
        <GeistText style={styles.helpText}>
          Выберите сотрудников, которые будут обслуживать этот дом
        </GeistText>

        {referenceData.loading.employees ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="hourglass-outline" size={32} color="#8E8E93" />
            <GeistText style={styles.emptyText}>Загрузка сотрудников...</GeistText>
          </View>
        ) : !formData.info.houseTariff.organization_id ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={32} color="#8E8E93" />
            <GeistText style={styles.emptyText}>
              Сначала выберите организацию в разделе &quot;Тариф&quot;
            </GeistText>
          </View>
        ) : referenceData.employees.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={32} color="#8E8E93" />
            <GeistText style={styles.emptyText}>
              У выбранной организации нет сотрудников
            </GeistText>
          </View>
        ) : (
          <View style={styles.employeeList}>
            {referenceData.employees.map((employee: any) => {
              const isSelected = organization.employees?.includes(employee.id.toString());
              return (
                <TouchableOpacity
                  key={employee.id}
                  style={[styles.employeeItem, isSelected && styles.employeeItemSelected]}
                  onPress={() => toggleEmployee(employee.id.toString())}
                  activeOpacity={0.7}
                >
                  <View style={styles.employeeInfo}>
                    <GeistText weight={500} style={styles.employeeName}>
                      {employee.full_name}
                    </GeistText>
                    <GeistText style={styles.employeePosition}>
                      {employee.position}
                    </GeistText>
                    <GeistText style={styles.employeePhone}>
                      {employee.phone}
                    </GeistText>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
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
    marginBottom: 12,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 4,
  },
  labelError: {
    color: '#FF3B30',
  },
  helpText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 15,
    color: '#007AFF',
    marginLeft: 8,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  employeeList: {
    gap: 8,
    marginTop: 12,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  employeeItemSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  employeeInfo: {
    flex: 1,
    gap: 4,
  },
  employeeName: {
    fontSize: 15,
    color: '#000000',
  },
  employeePosition: {
    fontSize: 13,
    color: '#8E8E93',
  },
  employeePhone: {
    fontSize: 13,
    color: '#8E8E93',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
});

export default HouseOrganizationStep;