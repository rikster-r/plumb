import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  LabeledInput,
  LabeledDropdown,
  FormRow,
  FormSection,
  LabeledSwitch,
  FormActions,
} from '@/components/formComponents';
import { GeistText } from '@/components/GeistText';
import { useHouseDetails } from '@/hooks/useHouseDetails';
import { useUser } from '@/context/currentUser';
import useSWRNative from '@nandorojo/swr-react-native';
import { fetcherWithToken } from '@/lib/fetcher';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface HouseInfo {
  city: string;
  region: string;
  area: string;
  complex: string;
  street: string;
  number: string;
  building: string;
  frame: string;
  count_entrance: string;
  count_floor: string;
  count_apartment: string;
  intercom_code: string;
  key_location: string;
  note: string;
  maintenance_from: string; // HH:MM
  maintenance_to: string; // HH:MM
  square: string;
  exceptServiceTime: ExceptServiceTime[];
  houseTariff: HouseTariffUpdate;
  address_type_id: string;
  commercial: boolean;
}

type Props = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
};

const EditHouseInfo = ({ setHasUnsavedChanges }: Props) => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, token } = useUser();
  const { house, isLoading: houseLoading } = useHouseDetails(id);
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<HouseInfo>({
    city: '',
    region: '',
    area: '',
    complex: '',
    street: '',
    number: '',
    frame: '',
    building: '',
    count_entrance: '',
    count_floor: '',
    count_apartment: '',
    square: '',
    intercom_code: '',
    key_location: '',
    maintenance_from: '',
    maintenance_to: '',
    address_type_id: '',
    commercial: false,
    note: '',
    houseTariff: {
      date_maintenance_from: '',
      date_maintenance_to: '',
      rate: false,
      sum_rate: null,
    },
    exceptServiceTime: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch address types
  const { data: addressTypes, isLoading: addressTypesLoading } = useSWRNative<
    { id: number; name: string }[]
  >(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/address-types`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
  );

  // Initialize form with house data
  useEffect(() => {
    if (house) {
      setFormData({
        city: house.city || '',
        region: house.region || '',
        area: house.area || '',
        complex: house.complex || '',
        street: house.street || '',
        number: house.number || '',
        frame: house.frame || '',
        building: house.building || '',
        count_entrance: house.count_entrance?.toString() || '',
        count_floor: house.count_floor?.toString() || '',
        count_apartment: house.count_apartment?.toString() || '',
        square: house.square || '',
        intercom_code: house.intercom_code || '',
        key_location: house.key_location || '',
        maintenance_from: house.maintenance_from || '',
        maintenance_to: house.maintenance_to || '',
        address_type_id: house.address_type_id?.toString() || '',
        commercial: house.commercial || false,
        note: house.note || '',
        houseTariff: {
          date_maintenance_from:
            house.house_tariff?.date_maintenance_from || '',
          date_maintenance_to: house.house_tariff?.date_maintenance_to || '',
          rate: house.house_tariff?.rate ?? false,
          sum_rate: house.house_tariff?.sum_rate ?? null,
        },
        exceptServiceTime: [],
      });

      setHasUnsavedChanges(false);
    }
  }, [house, setHasUnsavedChanges]);

  const updateField = (field: keyof HouseInfo, value: any) => {
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

  const updateTariffField = (field: keyof HouseTariffUpdate, value: any) => {
    setFormData((prev) => ({
      ...prev,
      houseTariff: {
        ...prev.houseTariff,
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.city.trim()) {
      newErrors.city = 'Город обязателен для заполнения';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Улица обязательна для заполнения';
    }
    if (!formData.number.trim()) {
      newErrors.number = 'Номер дома обязателен для заполнения';
    }
    if (!formData.maintenance_from.trim()) {
      newErrors.maintenance_from = 'Время начала обязательно';
    }
    if (!formData.maintenance_to.trim()) {
      newErrors.maintenance_to = 'Время окончания обязательно';
    }
    if (!formData.address_type_id) {
      newErrors.address_type_id = 'Тип адреса обязателен для выбора';
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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/houses/${id}/info`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            info: {
              city: formData.city,
              region: formData.region || null,
              area: formData.area || null,
              complex: formData.complex || null,
              street: formData.street,
              number: formData.number,
              frame: formData.frame || null,
              building: formData.building || null,
              count_entrance: formData.count_entrance
                ? parseInt(formData.count_entrance)
                : null,
              count_floor: formData.count_floor
                ? parseInt(formData.count_floor)
                : null,
              count_apartment: formData.count_apartment
                ? parseInt(formData.count_apartment)
                : null,
              square: formData.square || null,
              intercom_code: formData.intercom_code || null,
              key_location: formData.key_location || null,
              maintenance_from: formData.maintenance_from,
              maintenance_to: formData.maintenance_to,
              address_type_id: parseInt(formData.address_type_id),
              commercial: formData.commercial,
              note: formData.note || null,
              houseTariff: {
                branch_id: house ? house.house_tariff.branch_id : null,
                organization_id: house
                  ? house.house_tariff.organization_id
                  : null,
                date_maintenance_from:
                  formData.houseTariff.date_maintenance_from || null,
                date_maintenance_to:
                  formData.houseTariff.date_maintenance_to || null,
                rate: formData.houseTariff.rate,
                sum_rate: formData.houseTariff.sum_rate,
              },
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
              newErrors[key] = messages[0];
            }
          });
          setErrors(newErrors);
          Alert.alert('Ошибка валидации', 'Проверьте введенные данные');
        } else {
          throw new Error(data.message || 'Ошибка при сохранении');
        }
        return;
      }

      Alert.alert('Успешно', 'Информация о доме обновлена', [
        {
          text: 'OK',
          onPress: () => {
            setHasUnsavedChanges(false);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving house info:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  const addressTypeOptions =
    addressTypes?.map((type) => ({
      label: type.name,
      value: type.id.toString(),
    })) || [];

  if (houseLoading || addressTypesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <GeistText style={styles.loadingText}>Загрузка...</GeistText>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { paddingBottom: insets.bottom + 80 }]}>
        <KeyboardAwareScrollView
          style={[styles.scrollView]}
          showsVerticalScrollIndicator={false}
        >
          <FormSection title="Адрес">
            <LabeledInput
              label="Город*"
              value={formData.city}
              onChangeText={(t) => updateField('city', t)}
              placeholder="Москва"
              error={errors.city}
            />

            <FormRow>
              <LabeledInput
                label="Регион"
                value={formData.region}
                onChangeText={(t) => updateField('region', t)}
                placeholder="Московская обл."
              />
              <LabeledInput
                label="Район"
                value={formData.area}
                onChangeText={(t) => updateField('area', t)}
                placeholder="Левобережный"
              />
            </FormRow>

            <LabeledInput
              label="Жилой комплекс"
              value={formData.complex}
              onChangeText={(t) => updateField('complex', t)}
              placeholder="Северный парк"
            />

            <LabeledInput
              label="Улица*"
              value={formData.street}
              onChangeText={(t) => updateField('street', t)}
              placeholder="Сибиряковская"
              error={errors.street}
            />

            <FormRow>
              <LabeledInput
                label="Номер дома*"
                value={formData.number}
                onChangeText={(t) => updateField('number', t)}
                placeholder="5"
                error={errors.number}
              />
              <LabeledInput
                label="Корпус"
                value={formData.frame}
                onChangeText={(t) => updateField('frame', t)}
                placeholder="А"
              />
            </FormRow>

            <LabeledInput
              label="Строение"
              value={formData.building}
              onChangeText={(t) => updateField('building', t)}
              placeholder="1"
            />
          </FormSection>

          <FormSection title="Характеристики здания">
            <FormRow>
              <LabeledInput
                label="Подъезды"
                value={formData.count_entrance}
                onChangeText={(t) => updateField('count_entrance', t)}
                placeholder="6"
                keyboardType="numeric"
              />
              <LabeledInput
                label="Этажи"
                value={formData.count_floor}
                onChangeText={(t) => updateField('count_floor', t)}
                placeholder="16"
                keyboardType="numeric"
              />
            </FormRow>

            <FormRow>
              <LabeledInput
                label="Квартиры"
                value={formData.count_apartment}
                onChangeText={(t) => updateField('count_apartment', t)}
                placeholder="96"
                keyboardType="numeric"
              />
              <LabeledInput
                label="Площадь (м²)"
                value={formData.square}
                onChangeText={(t) => updateField('square', t)}
                placeholder="4500.50"
                keyboardType="decimal-pad"
              />
            </FormRow>
          </FormSection>

          <FormSection title="Доступ">
            <LabeledInput
              label="Код домофона"
              value={formData.intercom_code}
              onChangeText={(t) => updateField('intercom_code', t)}
              placeholder="148K"
            />

            <LabeledInput
              label="Место хранения ключей"
              value={formData.key_location}
              onChangeText={(t) => updateField('key_location', t)}
              placeholder="Консьерж"
            />
          </FormSection>

          <FormSection title="График обслуживания">
            <FormRow>
              <LabeledInput
                label="Дата начала"
                value={formData.houseTariff.date_maintenance_from}
                onChangeText={(t) =>
                  updateTariffField('date_maintenance_from', t)
                }
                placeholder="2024-01-01"
              />

              <LabeledInput
                label="Дата окончания"
                value={formData.houseTariff.date_maintenance_to}
                onChangeText={(t) =>
                  updateTariffField('date_maintenance_to', t)
                }
                placeholder="2024-12-31"
              />
            </FormRow>

            <FormRow>
              <LabeledInput
                label="Время начала*"
                value={formData.maintenance_from}
                onChangeText={(t) => updateField('maintenance_from', t)}
                placeholder="09:00"
                error={errors.maintenance_from}
              />
              <LabeledInput
                label="Время окончания*"
                value={formData.maintenance_to}
                onChangeText={(t) => updateField('maintenance_to', t)}
                placeholder="18:00"
                error={errors.maintenance_to}
              />
            </FormRow>
          </FormSection>

          <FormSection title="Тариф">
            <LabeledSwitch
              label="Фиксированный тариф"
              value={formData.houseTariff.rate}
              onValueChange={(value) => updateTariffField('rate', value)}
            />

            {formData.houseTariff.rate && (
              <LabeledInput
                label="Сумма тарифа"
                value={formData.houseTariff.sum_rate ?? ''}
                onChangeText={(t) => updateTariffField('sum_rate', t || null)}
                placeholder="15000"
                keyboardType="numeric"
              />
            )}
          </FormSection>

          <FormSection title="Классификация">
            <LabeledDropdown
              label="Тип адреса*"
              value={formData.address_type_id}
              onChangeValue={(value) => updateField('address_type_id', value)}
              options={addressTypeOptions}
              placeholder={addressTypesLoading ? 'Загрузка...' : 'Выберите тип'}
              error={errors.address_type_id}
            />

            <LabeledSwitch
              label="Коммерческая недвижимость"
              value={formData.commercial}
              onValueChange={(value) => updateField('commercial', value)}
            />
          </FormSection>

          <FormSection title="Примечание">
            <LabeledInput
              label="Дополнительная информация"
              value={formData.note}
              onChangeText={(t) => updateField('note', t)}
              placeholder="Дом с улучшенной планировкой..."
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
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

export default EditHouseInfo;
