import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import {
  LabeledInput,
  LabeledDropdown,
  FormRow,
  FormSection,
  BareInput,
  FormActions,
} from '@/components/formComponents';
import { useUser } from '@/context/currentUser';
import useSWRNative from '@nandorojo/swr-react-native';
import { fetcherWithToken } from '@/lib/fetcher';
import { useDeduplicatedSchedules } from '@/hooks/useDeduplicatedSchedules';
import { formatErrors } from '@/lib/errors';

interface FormErrors {
  [key: string]: any;
}

interface OrganizationFormData {
  name: string;
  full_name: string;
  address: string;
  phones: string[];
  schedule_id: string;
  time_from: string;
  time_end: string;
  start_cooperation: string;
  end_cooperation: string;
  branch_id: string;
  note: string;
}

const CreateOrganizationScreen = () => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    full_name: '',
    address: '',
    phones: [''],
    schedule_id: '',
    time_from: '',
    time_end: '',
    start_cooperation: '',
    end_cooperation: '',
    branch_id: '',
    note: '',
  });

  const { user, token } = useUser();
  const { schedules, schedulesLoading } = useDeduplicatedSchedules();
  const insets = useSafeAreaInsets();

  const { data: branches, isLoading: branchesLoading } = useSWRNative<Branch[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/branches`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

  const updateField = <K extends keyof OrganizationFormData>(
    key: K,
    value: OrganizationFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when field is modified
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
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

  const resetForm = () => {
    setFormData({
      name: '',
      full_name: '',
      address: '',
      phones: [''],
      schedule_id: '',
      time_from: '',
      time_end: '',
      start_cooperation: '',
      end_cooperation: '',
      branch_id: '',
      note: '',
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    router.back();
  };

  const handleCreate = async () => {
    const filledPhones = formData.phones.filter((p) => p.trim().length > 0);

    // Client-side validation
    const newErrors: FormErrors = {};

    const requiredFields: (keyof OrganizationFormData)[] = [
      'name',
      'schedule_id',
      'time_from',
      'time_end',
      'start_cooperation',
      'branch_id',
    ];
    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = ['Обязательное поле.'];
      }
    });
    if (filledPhones.length === 0) {
      newErrors.phones = [['Обязательное поле.']];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/organizations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          if (errorData.errors) {
            const formattedErrors: FormErrors = formatErrors(errorData.errors);
            setErrors(formattedErrors);

            throw new Error('Validation error');
          }
        }
        throw new Error('Не удалось создать организацию');
      }
      resetForm();
      router.back();
    } catch (err: any) {
      if (err.message !== 'Validation error') {
        Alert.alert('Ошибка', 'Произошла ошибка при создании дома');
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Prepare dropdown options
  const scheduleOptions = schedules
    ? schedules.map((schedule) => ({
        label: `${schedule.working}/${schedule.day_off} (${schedule.start_time}-${schedule.end_time})`,
        value: schedule.id.toString(),
      }))
    : [];

  const branchOptions = branches
    ? branches.map((branch) => ({
        label: branch.name,
        value: branch.id.toString(),
      }))
    : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <GeistText weight={600} style={styles.headerTitle}>
          Создать организацию
        </GeistText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form content */}
      <KeyboardAwareScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <FormSection title="Основная информация">
            <LabeledInput
              label="Название*"
              value={formData.name}
              onChangeText={(t) => updateField('name', t)}
              placeholder="ООО УК ЖилСервис"
              error={errors.name?.[0]}
            />
            <LabeledInput
              label="Полное юридическое название"
              value={formData.full_name ?? ''}
              onChangeText={(t) => updateField('full_name', t)}
              placeholder="Общество с ограниченной ответственностью..."
            />
            <LabeledInput
              label="Юридический адрес"
              value={formData.address ?? ''}
              onChangeText={(t) => updateField('address', t)}
              placeholder="Москва, ул. Ленина, д. 1"
            />
          </FormSection>

          <FormSection title="Контакты">
            <GeistText
              weight={500}
              style={[styles.label, errors.phones && styles.labelError]}
            >
              Телефоны*
            </GeistText>

            <View style={{ gap: 12 }}>
              {formData.phones.map((phone, index) => {
                const phoneErrors = errors.phones?.[index];

                return (
                  <View key={index}>
                    <View style={styles.phoneRow}>
                      <BareInput
                        value={phone}
                        onChangeText={(t) => updatePhone(index, t)}
                        placeholder="+7 (___) ___-__-__"
                        keyboardType="phone-pad"
                        style={phoneErrors ? styles.inputError : undefined}
                      />

                      {formData.phones.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removePhone(index)}
                          style={styles.removePhoneButton}
                        >
                          <Ionicons
                            name="close-outline"
                            size={24}
                            color="#FF3B30"
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {phoneErrors && (
                      <GeistText style={styles.errorText}>
                        {phoneErrors[0]}
                      </GeistText>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.addPhoneButton} onPress={addPhone}>
              <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
              <GeistText weight={500} style={styles.addPhoneText}>
                Добавить телефон
              </GeistText>
            </TouchableOpacity>
          </FormSection>

          <FormSection title="График и филиал">
            <LabeledDropdown
              label="График работы*"
              value={formData.schedule_id}
              onChangeValue={(value) => updateField('schedule_id', value)}
              options={scheduleOptions}
              placeholder={schedulesLoading ? 'Загрузка...' : 'Выберите график'}
              error={errors.schedule_id?.[0]}
            />

            <LabeledDropdown
              label="Филиал*"
              value={formData.branch_id}
              onChangeValue={(value) => updateField('branch_id', value)}
              options={branchOptions}
              placeholder={branchesLoading ? 'Загрузка...' : 'Выберите филиал'}
              error={errors.branch_id?.[0]}
            />

            <FormRow>
              <LabeledInput
                label="Время начала*"
                value={formData.time_from}
                onChangeText={(t) => updateField('time_from', t)}
                placeholder="09:00"
                error={errors.time_from?.[0]}
              />
              <LabeledInput
                label="Время окончания*"
                value={formData.time_end}
                onChangeText={(t) => updateField('time_end', t)}
                placeholder="18:00"
                error={errors.time_end?.[0]}
              />
            </FormRow>
          </FormSection>

          <FormSection title="Период сотрудничества">
            <FormRow>
              <LabeledInput
                label="Начало*"
                value={formData.start_cooperation}
                onChangeText={(t) => updateField('start_cooperation', t)}
                placeholder="01.01.2024"
                error={errors.start_cooperation?.[0]}
              />
              <LabeledInput
                label="Окончание"
                value={formData.end_cooperation ?? ''}
                onChangeText={(t) => updateField('end_cooperation', t)}
                placeholder="31.12.2026"
              />
            </FormRow>
          </FormSection>

          <FormSection title="Дополнительно">
            <LabeledInput
              label="Примечание"
              value={formData.note ?? ''}
              onChangeText={(t) => updateField('note', t)}
              placeholder="Дополнительная информация..."
              multiline
              numberOfLines={3}
            />
          </FormSection>

          <View style={{ height: 20 }} />
        </View>
      </KeyboardAwareScrollView>

      {/* Action buttons */}
      <View style={[styles.actionsContainer]}>
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleCreate}
          isSubmitting={isCreating}
          submitText="Создать"
          cancelText="Отмена"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    color: '#000000',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
    alignItems: 'flex-end',
    gap: 12,
  },
  removePhoneButton: {
    paddingBottom: 12,
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
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
});

export default CreateOrganizationScreen;
