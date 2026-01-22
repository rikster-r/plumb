import {
  BareInput,
  FormActions,
  FormRow,
  FormSection,
  LabeledDropdown,
  LabeledInput,
} from '@/components/formComponents';
import { GeistText } from '@/components/GeistText';
import { useUser } from '@/context/currentUser';
import { useDeduplicatedSchedules } from '@/hooks/useDeduplicatedSchedules';
import { useOrganizationDetails } from '@/hooks/useOrganizationDetails';
import { formatErrors } from '@/lib/errors';
import { fetcherWithToken } from '@/lib/fetcher';
import { Ionicons } from '@expo/vector-icons';
import useSWRNative from '@nandorojo/swr-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

type Props = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
};

const OrganizationEditScreen = ({ setHasUnsavedChanges }: Props) => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, token } = useUser();
  const { organization, isLoading: orgLoading } = useOrganizationDetails(id);
  const { schedules, schedulesLoading } = useDeduplicatedSchedules();
  const insets = useSafeAreaInsets();

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch branches
  const { data: branches, isLoading: branchesLoading } = useSWRNative<Branch[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/branches`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
  );

  // Initialize form with organization data
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        full_name: organization.full_name || '',
        address: organization.address || '',
        phones:
          organization.phones && organization.phones.length > 0
            ? organization.phones
            : [''],
        schedule_id: organization.schedule_id?.toString() || '',
        time_from: organization.time_from || '',
        time_end: organization.time_end || '',
        start_cooperation: organization.start_cooperation || '',
        end_cooperation: organization.end_cooperation || '',
        branch_id: organization.branch_id?.toString() || '',
        note: organization.note || '',
      });

      setHasUnsavedChanges(false);
    }
  }, [organization, setHasUnsavedChanges]);

  const updateField = (field: keyof OrganizationFormData, value: any) => {
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

  const handleSave = async () => {
    const validPhones = formData.phones.filter((p) => p.trim().length > 0);

    // Client-side validation
    const newErrors: Record<string, any> = {};
    const requiredFields = [
      'name',
      'branch_id',
      'schedule_id',
      'time_from',
      'time_end',
      'start_cooperation',
    ] as const;

    requiredFields.forEach((field) => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = ['Обязательное поле'];
      }
    });

    if (validPhones.length === 0) {
      newErrors.phones = [['Обязательное поле.']];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: formData.name,
        full_name: formData.full_name || null,
        address: formData.address || null,
        phones: validPhones.length > 0 ? validPhones : null,
        schedule_id: parseInt(formData.schedule_id),
        time_from: formData.time_from,
        time_end: formData.time_end,
        start_cooperation: formData.start_cooperation,
        end_cooperation: formData.end_cooperation || null,
        branch_id: parseInt(formData.branch_id),
        note: formData.note || null,
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/organizations/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const formattedErrors = formatErrors(data.errors);
          setErrors(formattedErrors);
          Alert.alert('Ошибка валидации', 'Проверьте введенные данные');
        } else {
          throw new Error(data || 'Ошибка при сохранении');
        }
        return;
      }

      Alert.alert('Успешно', 'Информация об организации обновлена', [
        {
          text: 'OK',
          onPress: () => {
            setHasUnsavedChanges(false);
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving organization:', error);
      Alert.alert('Ошибка сервера', 'Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  const scheduleOptions =
    schedules?.map((schedule) => ({
      label: `${schedule.working}/${schedule.day_off} (${schedule.start_time}-${schedule.end_time})`,
      value: schedule.id.toString(),
    })) || [];

  const branchOptions =
    branches?.map((branch) => ({
      label: branch.name,
      value: branch.id.toString(),
    })) || [];

  if (orgLoading || schedulesLoading || branchesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <GeistText style={styles.loadingText}>Загрузка...</GeistText>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { paddingBottom: insets.bottom + 100 }]}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <FormSection title="Основная информация">
            <LabeledInput
              label="Название*"
              value={formData.name}
              onChangeText={(t) => updateField('name', t)}
              placeholder="ООО УК ЖилСервис"
              error={errors.name}
            />

            <LabeledInput
              label="Полное наименование"
              value={formData.full_name}
              onChangeText={(t) => updateField('full_name', t)}
              placeholder="Общество с ограниченной ответственностью..."
              multiline
              numberOfLines={3}
            />

            <LabeledInput
              label="Адрес"
              value={formData.address}
              onChangeText={(t) => updateField('address', t)}
              placeholder="г. Москва, ул. Ленина, д. 1"
            />

            <LabeledDropdown
              label="Филиал*"
              value={formData.branch_id}
              onChangeValue={(value) => updateField('branch_id', value)}
              options={branchOptions}
              placeholder={branchesLoading ? 'Загрузка...' : 'Выберите филиал'}
              error={errors.branch_id}
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

          <FormSection title="График работы">
            <LabeledDropdown
              label="График*"
              value={formData.schedule_id}
              onChangeValue={(value) => updateField('schedule_id', value)}
              options={scheduleOptions}
              placeholder={schedulesLoading ? 'Загрузка...' : 'Выберите график'}
              error={errors.schedule_id}
            />

            <FormRow>
              <LabeledInput
                label="Время начала*"
                value={formData.time_from}
                onChangeText={(t) => updateField('time_from', t)}
                placeholder="09:00"
                error={errors.time_from}
              />
              <LabeledInput
                label="Время окончания*"
                value={formData.time_end}
                onChangeText={(t) => updateField('time_end', t)}
                placeholder="18:00"
                error={errors.time_end}
              />
            </FormRow>
          </FormSection>

          <FormSection title="Период сотрудничества">
            <FormRow>
              <LabeledInput
                label="Дата начала*"
                value={formData.start_cooperation}
                onChangeText={(t) => updateField('start_cooperation', t)}
                placeholder="01.01.2024"
                error={errors.start_cooperation}
              />
              <LabeledInput
                label="Дата окончания"
                value={formData.end_cooperation}
                onChangeText={(t) => updateField('end_cooperation', t)}
                placeholder="31.12.2024"
              />
            </FormRow>
          </FormSection>

          <FormSection title="Примечание">
            <LabeledInput
              label="Дополнительная информация"
              value={formData.note}
              onChangeText={(t) => updateField('note', t)}
              placeholder="Дополнительная информация об организации..."
              multiline
              numberOfLines={4}
            />
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
    paddingVertical: 10,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
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

export default OrganizationEditScreen;
