import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  LabeledInput,
  LabeledDropdown,
  FormSection,
  FormActions,
  BareInput,
  MultiSelectField,
} from '@/components/formComponents';
import { GeistText } from '@/components/GeistText';
import { useHouseDetails } from '@/hooks/useHouseDetails';
import { useOrganizationDetails } from '@/hooks/useOrganizationDetails';
import { useUser } from '@/context/currentUser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDeduplicatedSchedules } from '@/hooks/useDeduplicatedSchedules';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface HouseOrganizationFormData {
  address: string;
  phones: string[];
  schedule_id: string;
  employees: string[];
}

type Props = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
};

const EditHouseOrganization = ({ setHasUnsavedChanges }: Props) => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useUser();
  const { house, isLoading: houseLoading } = useHouseDetails(id);
  const insets = useSafeAreaInsets();

  // Get organization ID from house
  const organizationId = house?.organization_id?.toString() || '';

  // Fetch organization details
  const {
    organization,
    employees,
    isLoading: orgLoading,
  } = useOrganizationDetails(organizationId);
  const { schedules, schedulesLoading } = useDeduplicatedSchedules();

  const [formData, setFormData] = useState<HouseOrganizationFormData>({
    address: '',
    phones: [''],
    schedule_id: '',
    employees: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with organization data
  useEffect(() => {
    if (organization) {
      setFormData({
        address: organization.address || '',
        phones:
          organization.phones && organization.phones.length > 0
            ? organization.phones
            : [''],
        schedule_id: organization.schedule_id?.toString() || '',
        employees: [], // Will be populated from house-specific employee assignments
      });

      setHasUnsavedChanges(false);
    }
  }, [organization, setHasUnsavedChanges]);

  const updateField = (field: keyof HouseOrganizationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Filter valid phones
    const validPhones = formData.phones.filter((phone) => phone.trim() !== '');
    if (validPhones.length === 0) {
      newErrors.phones = 'Необходимо указать хотя бы один телефон';
    }

    if (!formData.schedule_id) {
      newErrors.schedule_id = 'График работы обязателен для выбора';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSaving(true);

    try {
      // Filter out empty phone numbers
      const validPhones = formData.phones.filter(
        (phone) => phone.trim() !== '',
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/houses/${id}/organization`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            organization: {
              address: formData.address || null,
              phones: validPhones,
              schedule_id: parseInt(formData.schedule_id),
              employees:
                formData.employees.length > 0
                  ? formData.employees.map((id) => parseInt(id))
                  : null,
            },
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          // Handle validation errors
          const newErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([key, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              // Remove 'organization.' prefix from error keys
              const cleanKey = key.replace('organization.', '');
              newErrors[cleanKey] = messages[0];
            }
          });
          setErrors(newErrors);
          Alert.alert('Ошибка валидации', 'Проверьте введенные данные');
        } else {
          throw new Error(data.message || 'Ошибка при сохранении');
        }
        return;
      }

      Alert.alert('Успешно', 'Данные организации обновлены', [
        {
          text: 'OK',
          onPress: () => {
            setHasUnsavedChanges(false);
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving house organization:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  const scheduleOptions =
    schedules?.map((schedule) => ({
      label: `${schedule.working}/${schedule.day_off} ${schedule.start_time}-${schedule.end_time}`,
      value: schedule.id.toString(),
    })) || [];

  if (houseLoading || orgLoading || schedulesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <GeistText style={styles.loadingText}>Загрузка...</GeistText>
      </View>
    );
  }

  if (!organization) {
    return (
      <View style={styles.loadingContainer}>
        <GeistText style={styles.errorText}>
          Организация не найдена для этого дома
        </GeistText>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { paddingBottom: insets.bottom + 80 }]}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <FormSection title="Данные организации">
            <GeistText
              weight={500}
              style={[styles.label, errors.phones && styles.labelError]}
            >
              Телефоны
            </GeistText>
            <View style={{ gap: 12 }}>
              {formData.phones.map((phone, index) => (
                <View key={index} style={styles.phoneRow}>
                  <View style={{ flex: 1 }}>
                    <BareInput
                      value={phone}
                      onChangeText={(t) => updatePhone(index, t)}
                      placeholder="+7 (___) ___-__-__"
                      keyboardType="default"
                    />
                  </View>
                  {formData.phones.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removePhone(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons
                        name="close-outline"
                        size={24}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            {errors.phones && (
              <GeistText style={styles.errorText}>{errors.phones}</GeistText>
            )}
            <TouchableOpacity style={styles.addButton} onPress={addPhone}>
              <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
              <GeistText weight={500} style={styles.addButtonText}>
                Добавить телефон
              </GeistText>
            </TouchableOpacity>

            <LabeledInput
              label="Адрес"
              value={formData.address}
              onChangeText={(t) => updateField('address', t)}
              placeholder="г. Москва, ул. Центральная, д. 21"
            />

            <LabeledDropdown
              label="График работы"
              value={formData.schedule_id}
              onChangeValue={(value) => updateField('schedule_id', value)}
              options={scheduleOptions}
              placeholder={schedulesLoading ? 'Загрузка...' : 'Выберите график'}
              error={errors.schedule_id}
            />
          </FormSection>

          <FormSection title="Сотрудники ОО">
            <MultiSelectField
              options={employees.map((e) => ({
                label: e.full_name,
                value: e.id.toString(),
              }))}
              selectedValues={formData.employees}
              onValueChange={(vals) => updateField('employees', vals)}
              loading={orgLoading}
              placeholder="Выберите сотрудников"
              emptyStateText="У данной организации нет сотрудников"
            />
            {errors.employees && (
              <GeistText style={styles.errorText}>{errors.employees}</GeistText>
            )}
          </FormSection>
        </KeyboardAwareScrollView>
      </View>
      <FormActions
        onCancel={() => router.back()}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        submitText="Сохранить"
        cancelText="Отмена"
        stickToBottom={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 8,
  },
  labelError: {
    color: '#FF3B30',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 15,
    color: '#007AFF',
    marginLeft: 8,
  },
  employeeContainer: {
    gap: 12,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  employeeInfo: {
    flex: 1,
    marginRight: 12,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 2,
  },
  employeePhone: {
    fontSize: 13,
    color: '#007AFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EditHouseOrganization;
