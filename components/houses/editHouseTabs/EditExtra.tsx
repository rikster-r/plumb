import {
  FormActions,
  FormSection,
  LabeledInput,
  LabeledSwitch,
  MultiSelectField,
} from '@/components/formComponents';
import { GeistText } from '@/components/GeistText';
import { useUser } from '@/context/currentUser';
import { useHouseDetails } from '@/hooks/useHouseDetails';
import { fetcherWithToken } from '@/lib/fetcher';
import useSWRNative from '@nandorojo/swr-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HouseOther {
  barrier: boolean;
  barrier_not: string | null;
  basement: boolean;
  basement_not: string | null;
  technical_floor: boolean;
  technical_floor_not: string | null;
  vru: string | null;
  dhw: string | null;
  cws: string | null;
  heating_unit: string | null;
  pump: string | null;
  resource_organizations: string[]; // Array of resource org IDs
}

type Props = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
};

const HouseEditExtrasScreen = ({ setHasUnsavedChanges }: Props) => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, token } = useUser();
  const { house, isLoading: houseLoading } = useHouseDetails(id);
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<HouseOther>({
    barrier: false,
    barrier_not: '',
    basement: false,
    basement_not: '',
    technical_floor: false,
    technical_floor_not: '',
    vru: '',
    dhw: '',
    cws: '',
    heating_unit: '',
    pump: '',
    resource_organizations: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch resource organizations
  const { data: resourceOrganizations, isLoading: resourceOrgsLoading } =
    useSWRNative<ResourceOrganization[]>(
      user && token
        ? [`${process.env.EXPO_PUBLIC_API_URL}/resource-organizations`, token]
        : null,
      ([url, token]) => fetcherWithToken(url, token),
    );

  // Initialize form with house data
  useEffect(() => {
    if (house) {
      setFormData({
        barrier: house.barrier || false,
        barrier_not: '',
        basement: house.basement || false,
        basement_not: '',
        technical_floor: house.technical_floor || false,
        technical_floor_not: '',
        vru: house.vru || '',
        dhw: house.dhw || '',
        cws: house.cws || '',
        heating_unit: house.heating_unit || '',
        pump: house.pump || '',
        resource_organizations: [],
      });

      setHasUnsavedChanges(false);
    }
  }, [house, setHasUnsavedChanges]);

  const updateField = (field: keyof HouseOther, value: any) => {
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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/houses/${id}/extra`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            other: {
              barrier: formData.barrier,
              barrier_not: formData.barrier_not || null,
              basement: formData.basement,
              basement_not: formData.basement_not || null,
              technical_floor: formData.technical_floor,
              technical_floor_not: formData.technical_floor_not || null,
              vru: formData.vru || null,
              dhw: formData.dhw || null,
              cws: formData.cws || null,
              heating_unit: formData.heating_unit || null,
              pump: formData.pump || null,
              resource_organizations:
                formData.resource_organizations.length > 0
                  ? formData.resource_organizations.map((id) => parseInt(id))
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

      Alert.alert('Успешно', 'Дополнительная информация обновлена', [
        {
          text: 'OK',
          onPress: () => {
            setHasUnsavedChanges(false);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving house extras:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  if (houseLoading || resourceOrgsLoading) {
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
          <FormSection title="Инфраструктура">
            <View style={styles.switchContainer}>
              <LabeledSwitch
                label="Наличие шлагбаума"
                value={formData.barrier}
                onValueChange={(value) => updateField('barrier', value)}
              />
            </View>

            {formData.barrier && (
              <LabeledInput
                label="Расположение шлагбаума"
                value={formData.barrier_not ?? ''}
                onChangeText={(t) => updateField('barrier_not', t)}
                placeholder="Шлагбаум на въезде"
                multiline
                numberOfLines={3}
              />
            )}

            <View style={styles.switchContainer}>
              <LabeledSwitch
                label="Наличие подвала"
                value={formData.basement}
                onValueChange={(value) => updateField('basement', value)}
              />
            </View>

            {formData.basement && (
              <LabeledInput
                label="Расположение подвала"
                value={formData.basement_not ?? ''}
                onChangeText={(t) => updateField('basement_not', t)}
                placeholder="Отапливаемый подвал"
                multiline
                numberOfLines={3}
              />
            )}

            <View style={styles.switchContainer}>
              <LabeledSwitch
                label="Наличие тех. этажа"
                value={formData.technical_floor}
                onValueChange={(value) => updateField('technical_floor', value)}
              />
            </View>

            {formData.technical_floor && (
              <LabeledInput
                label="Расположение тех. этажа"
                value={formData.technical_floor_not ?? ''}
                onChangeText={(t) => updateField('technical_floor_not', t)}
                placeholder="Технический этаж между 8 и 9 этажами"
                multiline
                numberOfLines={3}
              />
            )}
          </FormSection>

          <FormSection title="Оборудование">
            <LabeledInput
              label="ВРУ (Вводно-распределительное устройство)"
              value={formData.vru ?? ''}
              onChangeText={(t) => updateField('vru', t)}
              placeholder="ВРУ-1"
              multiline
              numberOfLines={3}
            />

            <LabeledInput
              label="ГВС (Горячее водоснабжение)"
              value={formData.dhw ?? ''}
              onChangeText={(t) => updateField('dhw', t)}
              placeholder="Элеваторный узел"
              multiline
              numberOfLines={3}
            />

            <LabeledInput
              label="ХВС (Холодное водоснабжение)"
              value={formData.cws ?? ''}
              onChangeText={(t) => updateField('cws', t)}
              placeholder="Централизованное"
              multiline
              numberOfLines={3}
            />

            <LabeledInput
              label="Теплоузел"
              value={formData.heating_unit ?? ''}
              onChangeText={(t) => updateField('heating_unit', t)}
              placeholder="Индивидуальный тепловой пункт"
              multiline
              numberOfLines={3}
            />

            <LabeledInput
              label="Насосная"
              value={formData.pump ?? ''}
              onChangeText={(t) => updateField('pump', t)}
              placeholder="Grundfos UPS 32-60"
              multiline
              numberOfLines={3}
            />
          </FormSection>

          <FormSection title="Ресурсоснабжающие организации">
            {!resourceOrgsLoading &&
            (!resourceOrganizations || resourceOrganizations.length === 0) ? (
              <GeistText style={styles.emptyText}>
                Нет доступных организаций
              </GeistText>
            ) : (
              <MultiSelectField
                label={'Ресурсоснабжающие организации'}
                options={(resourceOrganizations ?? []).map((org) => ({
                  label: org.name,
                  value: org.id.toString(),
                }))}
                selectedValues={formData.resource_organizations}
                onValueChange={(vals) =>
                  setFormData((prev) => ({
                    ...prev,
                    resource_organizations: vals,
                  }))
                }
                placeholder="Выберите организации"
                loading={resourceOrgsLoading}
              />
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  switchContainer: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  checkboxContainer: {
    gap: 12,
  },
  checkboxItem: {
    marginBottom: 8,
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

export default HouseEditExtrasScreen;
