import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from './BottomSheet';
import { GeistText } from './GeistText';

interface FormData {
  city: string;
  street: string;
  number: string;
  count_entrance: string;
  count_floor: string;
  count_apartment: string;
  square: string;
  intercom_code: string;
  key_location: string;
  maintenance_from: string;
  maintenance_to: string;
  lat: string;
  long: string;
  commercial: boolean;
  note: string;
}

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onCreate: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

const CreateHouseBottomSheet = ({
  bottomSheetRef,
  onCreate,
  onClose,
}: Props) => {
  const [formData, setFormData] = useState<FormData>({
    city: '',
    street: '',
    number: '',
    count_entrance: '',
    count_floor: '',
    count_apartment: '',
    square: '',
    intercom_code: '',
    key_location: '',
    maintenance_from: '09:00',
    maintenance_to: '18:00',
    lat: '',
    long: '',
    commercial: false,
    note: '',
  });

  const [isCreating, setIsCreating] = useState(false);

  const resetForm = () => {
    setFormData({
      city: '',
      street: '',
      number: '',
      count_entrance: '',
      count_floor: '',
      count_apartment: '',
      square: '',
      intercom_code: '',
      key_location: '',
      maintenance_from: '09:00',
      maintenance_to: '18:00',
      lat: '',
      long: '',
      commercial: false,
      note: '',
    });
  };

  const handleCreate = async () => {
    if (!formData.city || !formData.street || !formData.number) {
      alert('Заполните обязательные поля: город, улица, номер дома');
      return;
    }

    setIsCreating(true);
    try {
      await onCreate(formData);
      resetForm();
      onClose();
    } catch (err) {
      // Error handling is done in parent
    } finally {
      setIsCreating(false);
    }
  };

  const handleDismiss = () => {
    resetForm();
    onClose();
  };

  return (
    <BottomSheet
      sheetRef={bottomSheetRef}
      title="Создать дом"
      snapPoints={['90%']}
      onDismiss={handleDismiss}
    >
      <View style={styles.formContainer}>
        {/* === Обязательные поля === */}
        <GeistText weight={600} style={styles.sectionTitle}>
          Обязательные поля
        </GeistText>

        <View style={styles.formGroup}>
          <GeistText weight={500} style={styles.label}>
            Город *
          </GeistText>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(t) => setFormData({ ...formData, city: t })}
            placeholder="Воронеж"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <View style={styles.formGroup}>
          <GeistText weight={500} style={styles.label}>
            Улица *
          </GeistText>
          <TextInput
            style={styles.input}
            value={formData.street}
            onChangeText={(t) => setFormData({ ...formData, street: t })}
            placeholder="Острогожская"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <View style={styles.formGroup}>
          <GeistText weight={500} style={styles.label}>
            Номер дома *
          </GeistText>
          <TextInput
            style={styles.input}
            value={formData.number}
            onChangeText={(t) => setFormData({ ...formData, number: t })}
            placeholder="158/2"
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* === Характеристики здания === */}
        <GeistText weight={600} style={styles.sectionTitle}>
          Характеристики здания
        </GeistText>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              Подъезды
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.count_entrance}
              onChangeText={(t) =>
                setFormData({ ...formData, count_entrance: t })
              }
              placeholder="4"
              keyboardType="numeric"
              placeholderTextColor="#8E8E93"
            />
          </View>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              Этажи
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.count_floor}
              onChangeText={(t) =>
                setFormData({ ...formData, count_floor: t })
              }
              placeholder="9"
              keyboardType="numeric"
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              Квартиры
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.count_apartment}
              onChangeText={(t) =>
                setFormData({ ...formData, count_apartment: t })
              }
              placeholder="72"
              keyboardType="numeric"
              placeholderTextColor="#8E8E93"
            />
          </View>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              Площадь (м²)
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.square}
              onChangeText={(t) => setFormData({ ...formData, square: t })}
              placeholder="3240.50"
              keyboardType="decimal-pad"
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        {/* === Информация о доступе === */}
        <GeistText weight={600} style={styles.sectionTitle}>
          Информация о доступе
        </GeistText>

        <View style={styles.formGroup}>
          <GeistText weight={500} style={styles.label}>
            Код домофона
          </GeistText>
          <TextInput
            style={styles.input}
            value={formData.intercom_code}
            onChangeText={(t) =>
              setFormData({ ...formData, intercom_code: t })
            }
            placeholder="1234"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <View style={styles.formGroup}>
          <GeistText weight={500} style={styles.label}>
            Местонахождение ключей
          </GeistText>
          <TextInput
            style={styles.input}
            value={formData.key_location}
            onChangeText={(t) =>
              setFormData({ ...formData, key_location: t })
            }
            placeholder="У консьержа"
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* === График обслуживания === */}
        <GeistText weight={600} style={styles.sectionTitle}>
          График обслуживания
        </GeistText>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              С (ЧЧ:ММ)
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.maintenance_from}
              onChangeText={(t) =>
                setFormData({ ...formData, maintenance_from: t })
              }
              placeholder="09:00"
              placeholderTextColor="#8E8E93"
            />
          </View>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              До (ЧЧ:ММ)
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.maintenance_to}
              onChangeText={(t) =>
                setFormData({ ...formData, maintenance_to: t })
              }
              placeholder="18:00"
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        {/* === Координаты === */}
        <GeistText weight={600} style={styles.sectionTitle}>
          Координаты
        </GeistText>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              Широта
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.lat}
              onChangeText={(t) => setFormData({ ...formData, lat: t })}
              placeholder="51.6605"
              keyboardType="decimal-pad"
              placeholderTextColor="#8E8E93"
            />
          </View>
          <View style={[styles.formGroup, styles.formGroupHalf]}>
            <GeistText weight={500} style={styles.label}>
              Долгота
            </GeistText>
            <TextInput
              style={styles.input}
              value={formData.long}
              onChangeText={(t) => setFormData({ ...formData, long: t })}
              placeholder="39.2007"
              keyboardType="decimal-pad"
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        {/* === Коммерческая недвижимость === */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() =>
            setFormData({ ...formData, commercial: !formData.commercial })
          }
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              formData.commercial && styles.checkboxChecked,
            ]}
          >
            {formData.commercial && (
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            )}
          </View>
          <GeistText weight={400} style={styles.checkboxLabel}>
            Коммерческая недвижимость
          </GeistText>
        </TouchableOpacity>

        {/* === Примечание === */}
        <View style={styles.formGroup}>
          <GeistText weight={500} style={styles.label}>
            Примечание
          </GeistText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.note}
            onChangeText={(t) => setFormData({ ...formData, note: t })}
            placeholder="Дополнительная информация..."
            placeholderTextColor="#8E8E93"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* === Кнопки === */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <GeistText weight={600} style={styles.cancelButtonText}>
              Отмена
            </GeistText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createButton,
              isCreating && styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={isCreating}
            activeOpacity={0.7}
          >
            {isCreating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <GeistText weight={600} style={styles.createButtonText}>
                Создать
              </GeistText>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  createButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default CreateHouseBottomSheet;