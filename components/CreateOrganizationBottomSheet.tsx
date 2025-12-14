import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from './BottomSheet';
import { GeistText } from './GeistText';

import {
  LabeledInput,
  LabeledDropdown,
  FormRow,
  FormSection,
  FormActions,
  BareInput,
} from './formComponents';
import { useUser } from '@/context/currentUser';
import useSWRNative from '@nandorojo/swr-react-native';
import { fetcherWithToken } from '@/lib/fetcher';

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

interface Branch {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  working: number;
  day_off: number;
  start_time: string; // Format: "HH:MM"
  end_time: string; // Format: "HH:MM"
}

interface FormErrors {
  [key: string]: string[];
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
  const { data: schedulesRaw, isLoading: schedulesLoading } = useSWRNative<
    Schedule[]
  >(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/schedules`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );
  const schedules = useMemo(() => {
    if (!schedulesRaw) return [];

    const map = new Map<string, Schedule>();

    for (const s of schedulesRaw) {
      const key = `${s.working}-${s.day_off}-${s.start_time}-${s.end_time}`;
      if (!map.has(key)) {
        map.set(key, s);
      }
    }

    return Array.from(map.values());
  }, [schedulesRaw]);

  const { data: branches, isLoading: branchesLoading } = useSWRNative<Branch[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/branches`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

  const updateField = <K extends keyof OrganizationFormData>(
    key: K,
    value: OrganizationFormData[K]
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
      if (!formData[field].toString().trim()) {
        newErrors[field] = ['Обязательное поле.'];
      }
    });
    if (filledPhones.length === 0) {
      newErrors.phones = ['Обязательное поле.'];
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

      await onCreate(payload);
      resetForm();
      onClose();
    } catch (err: any) {
      // Handle server errors
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert('Произошла ошибка при создании организации');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDismiss = () => {
    resetForm();
    onClose();
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
    <BottomSheet
      sheetRef={bottomSheetRef}
      title="Создать организацию"
      snapPoints={['90%']}
      onDismiss={handleDismiss}
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
          <GeistText
            weight={500}
            style={[styles.label, errors.phones && styles.labelError]}
          >
            Телефоны*
          </GeistText>
          <View style={{ gap: 12 }}>
            {formData.phones.map((phone, index) => (
              <View key={index} style={styles.phoneRow}>
                <BareInput
                  value={phone}
                  onChangeText={(t) => updatePhone(index, t)}
                  placeholder="+7 (___) ___-__-__"
                  keyboardType="phone-pad"
                  style={errors.phones ? styles.inputError : undefined}
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
          </View>
          
          {errors.phones && (
            <GeistText style={styles.errorText}>{errors.phones[0]}</GeistText>
          )}
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
              value={formData.end_cooperation}
              onChangeText={(t) => updateField('end_cooperation', t)}
              placeholder="31.12.2026"
            />
          </FormRow>
        </FormSection>

        <FormSection title="Дополнительно">
          <LabeledInput
            label="Примечание"
            value={formData.note}
            onChangeText={(t) => updateField('note', t)}
            placeholder="Дополнительная информация..."
            multiline
            numberOfLines={3}
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
  textArea: {},
});

export default CreateOrganizationBottomSheet;
