import { Ionicons } from '@expo/vector-icons';
import useSWRNative from '@nandorojo/swr-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { GeistText } from '@/components/GeistText';
import { FormActions } from '@/components/formComponents';
import { useUser } from '@/context/currentUser';
import { fetcherWithToken } from '@/lib/fetcher';

// Import step components (to be created)
import HouseInfoStep from '@/components/houses/createHouseSteps/HouseInfoStep';
import HouseOrganizationStep from '@/components/houses/createHouseSteps/HouseOrganizationStep';
import HouseReviewStep from '@/components/houses/createHouseSteps/HouseReviewStep';
import HouseTariffStep from '@/components/houses/createHouseSteps/HouseTariffStep';
import HouseTechnicalStep from '@/components/houses/createHouseSteps/HouseTechnicalStep';
import { mutate } from 'swr';
import { useDeduplicatedSchedules } from '@/hooks/useDeduplicatedSchedules';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  houseTariff: HouseTariffCreate;
  address_type_id: string;
  commercial: boolean;
}

interface HouseOrganization {
  address: string;
  phones: string[];
  schedule_id: string;
  employees: string[]; // Array of employee IDs
}

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

interface HouseFormData {
  info: HouseInfo;
  organization: HouseOrganization;
  other: HouseOther;
}

interface FormErrors {
  [key: string]: string[] | FormErrors;
}

const STEPS = [
  { id: 'info', title: 'Основная информация', component: HouseInfoStep },
  { id: 'tariff', title: 'Тариф', component: HouseTariffStep },
  {
    id: 'organization',
    title: 'Организация',
    component: HouseOrganizationStep,
  },
  {
    id: 'technical',
    title: 'Технические данные',
    component: HouseTechnicalStep,
  },
  { id: 'review', title: 'Проверка', component: HouseReviewStep },
];

const CreateHouseScreen = () => {
  const { user, token } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const insets = useSafeAreaInsets();

  // Initialize form data with empty values
  const [formData, setFormData] = useState<HouseFormData>({
    info: {
      city: '',
      region: '',
      area: '',
      complex: '',
      street: '',
      number: '',
      building: '',
      frame: '',
      count_entrance: '',
      count_floor: '',
      count_apartment: '',
      intercom_code: '',
      key_location: '',
      note: '',
      maintenance_from: '',
      maintenance_to: '',
      square: '',
      exceptServiceTime: [],
      houseTariff: {
        branch_id: '',
        organization_id: '',
        date_maintenance_from: '',
        date_maintenance_to: '',
        rate: false,
        sum_rate: '',
      },
      address_type_id: '',
      commercial: false,
    },
    organization: {
      address: '',
      phones: [''],
      schedule_id: '',
      employees: [],
    },
    other: {
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
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch reference data
  const { data: addressTypes, isLoading: addressTypesLoading } = useSWRNative<
    AddressType[]
  >(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/address-types`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const { data: branches, isLoading: branchesLoading } = useSWRNative<Branch[]>(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/branches`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const { data: organizations, isLoading: organizationsLoading } = useSWRNative<
    Organization[]
  >(
    user && token
      ? [`${process.env.EXPO_PUBLIC_API_URL}/organizations`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const { schedules, schedulesLoading } = useDeduplicatedSchedules();

  const { data: resourceOrganizations, isLoading: resourceOrgsLoading } =
    useSWRNative<ResourceOrganization[]>(
      user && token
        ? [`${process.env.EXPO_PUBLIC_API_URL}/resource-organizations`, token]
        : null,
      ([url, token]) => fetcherWithToken(url, token)
    );

  // Fetch employees for selected organization
  const selectedOrgId = formData.info.houseTariff.organization_id;
  const { data: employees, isLoading: employeesLoading } = useSWRNative<
    Employee[]
  >(
    user && token && selectedOrgId
      ? [
          `${process.env.EXPO_PUBLIC_API_URL}/organizations/${selectedOrgId}/employees`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  // Update form data
  const updateFormData = (section: string, data: Partial<any>) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof HouseFormData],
        ...data,
      },
    }));
    // Only clear errors for the updated fields
    if (errors[section]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (
          typeof newErrors[section] === 'object' &&
          newErrors[section] !== null
        ) {
          const sectionErrors = {
            ...(newErrors[section] as { [key: string]: any }),
          };
          Object.keys(data).forEach((field) => {
            delete sectionErrors[field];
          });
          // If no errors left in section, remove the section error
          if (Object.keys(sectionErrors).length === 0) {
            delete newErrors[section];
          } else {
            newErrors[section] = sectionErrors;
          }
        } else {
          delete newErrors[section];
        }
        return newErrors;
      });
    }
  };

  // Validation helpers
  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 0: // Info step
        const infoRequired = [
          'city',
          'street',
          'number',
          'maintenance_from',
          'maintenance_to',
          'address_type_id',
        ];
        infoRequired.forEach((field) => {
          if (!formData.info[field as keyof HouseInfo]?.toString().trim()) {
            if (!newErrors.info) newErrors.info = {};
            (newErrors.info as FormErrors)[field] = ['Обязательное поле.'];
          }
        });
        break;

      case 1: // Tariff step
        if (!formData.info.houseTariff.branch_id) {
          if (!newErrors.info) newErrors.info = {};
          (newErrors.info as FormErrors).houseTariff = {
            branch_id: ['Обязательное поле.'],
          };
        }
        if (!formData.info.houseTariff.organization_id) {
          if (!newErrors.info) newErrors.info = {};
          if (!(newErrors.info as FormErrors).houseTariff) {
            (newErrors.info as FormErrors).houseTariff = {};
          }
          (
            (newErrors.info as FormErrors).houseTariff as FormErrors
          ).organization_id = ['Обязательное поле.'];
        }
        break;

      case 2: // Organization step
        const filledPhones = formData.organization.phones.filter(
          (p) => p.trim().length > 0
        );
        if (filledPhones.length === 0) {
          if (!newErrors.organization) newErrors.organization = {};
          (newErrors.organization as FormErrors).phones = [
            'Необходим хотя бы один телефон.',
          ];
        }
        if (!formData.organization.schedule_id) {
          if (!newErrors.organization) newErrors.organization = {};
          (newErrors.organization as FormErrors).schedule_id = [
            'Обязательное поле.',
          ];
        }
        break;

      case 3: // Technical step - all boolean fields are required but have defaults
        // No validation needed as booleans have default false values
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Navigation
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  // Create house
  const handleCreate = async () => {
    if (!validateCurrentStep()) return;

    setIsCreating(true);
    try {
      // Transform form data to API format
      const payload: any = {
        info: {
          ...formData.info,
          count_entrance: formData.info.count_entrance
            ? parseInt(formData.info.count_entrance)
            : null,
          count_floor: formData.info.count_floor
            ? parseInt(formData.info.count_floor)
            : null,
          count_apartment: formData.info.count_apartment
            ? parseInt(formData.info.count_apartment)
            : null,
          square: formData.info.square
            ? parseFloat(formData.info.square)
            : null,
          address_type_id: parseInt(formData.info.address_type_id),
          houseTariff: {
            branch_id: parseInt(formData.info.houseTariff.branch_id as string),
            organization_id: parseInt(
              formData.info.houseTariff.organization_id as string
            ),
            date_maintenance_from:
              formData.info.houseTariff.date_maintenance_from || null,
            date_maintenance_to:
              formData.info.houseTariff.date_maintenance_to || null,
            rate: formData.info.houseTariff.rate,
            sum_rate: formData.info.houseTariff.sum_rate
              ? parseFloat(formData.info.houseTariff.sum_rate)
              : null,
          },
        },
        organization: {
          ...formData.organization,
          phones: formData.organization.phones.filter(
            (p) => p.trim().length > 0
          ),
          schedule_id: parseInt(formData.organization.schedule_id),
          employees: formData.organization.employees.map((e) => parseInt(e)),
        },
        other: {
          ...formData.other,
          resource_organizations: formData.other.resource_organizations.map(
            (r) => parseInt(r)
          ),
        },
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/houses`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          if (errorData.errors) {
            /*
            Map over returned object like this 
              {"info.houseTariff.branch_id": [""]]} 
            and turn into like this 
              {"info": {"houseTariff": {"branch_id": [""]}}}
            */
            const formattedErrors: FormErrors = Object.entries(
              errorData.errors
            ).reduce((acc: FormErrors, [path, value]) => {
              const keys = path.split('.');
              const errorValue = value as string[];

              let current: any = acc;

              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                // last key → assign value
                if (i === keys.length - 1) {
                  current[key] = errorValue;
                } else {
                  // create object if missing
                  if (!current[key]) {
                    current[key] = {};
                  }
                  current = current[key];
                }
              }

              return acc;
            }, {});
            setErrors(formattedErrors);

            // Navigate to first step with errors
            if ('houseTariff' in formattedErrors.info) {
              setCurrentStep(1);
            } else if (formattedErrors.info) {
              setCurrentStep(0);
            } else if (formattedErrors.organization) {
              setCurrentStep(2);
            } else if (formattedErrors.other) {
              setCurrentStep(3);
            }
          }
          throw new Error('Validation error');
        }
        throw new Error('Failed to create house');
      }

      Alert.alert('Успешно', 'Дом создан успешно', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);

      mutate(`${process.env.EXPO_PUBLIC_API_URL}/houses`);
    } catch (err: any) {
      if (err.message !== 'Validation error') {
        Alert.alert('Ошибка', 'Произошла ошибка при создании дома');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    if (currentStep === 0) {
      Alert.alert('Отменить создание?', 'Все введенные данные будут потеряны', [
        { text: 'Продолжить', style: 'cancel' },
        {
          text: 'Отменить',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
    } else {
      handlePrevious();
    }
  };

  // Reference data for child components
  const referenceData = {
    addressTypes: addressTypes || [],
    branches: branches || [],
    organizations: organizations || [],
    schedules: schedules || [],
    resourceOrganizations: resourceOrganizations || [],
    employees: employees || [],
    loading: {
      addressTypes: addressTypesLoading,
      branches: branchesLoading,
      organizations: organizationsLoading,
      schedules: schedulesLoading,
      resourceOrganizations: resourceOrgsLoading,
      employees: employeesLoading,
    },
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <GeistText weight={600} style={styles.headerTitle}>
          Создать дом
        </GeistText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Step content */}
      <KeyboardAwareScrollView
        style={styles.stepContent}
        contentContainerStyle={styles.stepContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          referenceData={referenceData}
        />

        <View style={{ height: 20 }} />
      </KeyboardAwareScrollView>

      {/* Navigation buttons */}
      <View
        style={[
          styles.navigationContainer,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <FormActions
          onCancel={handleCancel}
          onSubmit={
            currentStep === STEPS.length - 1 ? handleCreate : handleNext
          }
          isSubmitting={isCreating}
          submitText={currentStep === STEPS.length - 1 ? 'Создать' : 'Далее'}
          cancelText={currentStep === 0 ? 'Отмена' : 'Назад'}
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
    paddingTop: 60,
    paddingBottom: 16,
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
  stepIndicatorScroll: {
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    maxHeight: '10%',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minWidth: '100%',
    maxHeight: 100,
  },
  stepItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#007AFF',
  },
  stepCircleCompleted: {
    backgroundColor: '#34C759',
  },
  stepCircleDisabled: {
    backgroundColor: '#E5E5EA',
  },
  stepNumber: {
    fontSize: 14,
    color: '#8E8E93',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
  },
  stepTitleActive: {
    color: '#007AFF',
  },
  stepConnector: {
    height: 2,
    backgroundColor: '#E5E5EA',
    width: 20,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  navigationContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
});

export default CreateHouseScreen;
