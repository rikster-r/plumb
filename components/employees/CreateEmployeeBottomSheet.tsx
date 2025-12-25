import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LabeledInput, FormSection } from '../formComponents';
import { useUser } from '@/context/currentUser';
import { KeyedMutator } from 'swr';
import BottomSheetForm from '../BottomSheetForm';

interface FormErrors {
  [key: string]: string[];
}

interface EmployeeFormData {
  full_name: string;
  position: string;
  phone: string;
  note: string;
}

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  mutate: KeyedMutator<Employee[]>;
  onClose: () => void;
}

const AddEmployeeBottomSheet = ({
  bottomSheetRef,
  onClose,
  mutate,
}: Props) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    full_name: '',
    position: '',
    phone: '',
    note: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isCreating, setIsCreating] = useState(false);
  const { token } = useUser();

  const updateField = <K extends keyof EmployeeFormData>(
    key: K,
    value: EmployeeFormData[K]
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

  const resetForm = () => {
    setFormData({
      full_name: '',
      position: '',
      phone: '',
      note: '',
    });
    setErrors({});
  };

  const handleCreate = async () => {
    // Client-side validation
    const newErrors: FormErrors = {};

    const requiredFields: (keyof EmployeeFormData)[] = [
      'full_name',
      'position',
      'phone',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = ['Обязательное поле.'];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCreating(true);
    try {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/organizations`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setErrors(errorData.errors);
        }

        await mutate();
        resetForm();
        onClose();
      } catch (error: any) {
        alert(error.message || 'Ошибка при создании организации');
        throw error;
      }
      resetForm();
      onClose();
    } catch (err: any) {
      // Handle server errors
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert('Произошла ошибка при создании сотрудника');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDismiss = () => {
    resetForm();
    onClose();
  };

  return (
    <BottomSheetForm
      sheetRef={bottomSheetRef}
      title="Добавить сотрудника"
      onDismiss={handleDismiss}
      handleFormSubmit={handleCreate}
      isFormSubmitting={isCreating}
      submitText="Добавить"
      cancelText="Отмена"
    >
      <View style={styles.formContainer}>
        <FormSection title="Информация о сотруднике">
          <LabeledInput
            label="ФИО*"
            value={formData.full_name}
            onChangeText={(t) => updateField('full_name', t)}
            placeholder="Иванов Иван Иванович"
            error={errors.full_name?.[0]}
          />
          <LabeledInput
            label="Должность*"
            value={formData.position}
            onChangeText={(t) => updateField('position', t)}
            placeholder="Директор"
            error={errors.position?.[0]}
          />
          <LabeledInput
            label="Телефон*"
            value={formData.phone}
            onChangeText={(t) => updateField('phone', t)}
            placeholder="+7 (___) ___-__-__"
            error={errors.phone?.[0]}
          />
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
      </View>
    </BottomSheetForm>
  );
};

const styles = StyleSheet.create({
  formContainer: {},
});

export default AddEmployeeBottomSheet;
