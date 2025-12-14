// app/components/formComponents/MultiSelectField.tsx
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectFieldProps {
  label?: string;
  options: Option[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  error?: string[];
  loading?: boolean;
}

const MultiSelectField = ({
  label,
  options,
  selectedValues,
  onValueChange,
  placeholder = 'Выберите элементы',
  error,
  loading = false,
}: MultiSelectFieldProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  const displayText =
    selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onValueChange(selectedValues.filter((v) => v !== value));
    } else {
      onValueChange([...selectedValues, value]);
    }
  };

  const renderItem = ({ item }: { item: Option }) => {
    const isSelected = selectedValues.includes(item.value);

    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => toggleValue(item.value)}
      >
        <View style={styles.checkboxContainer}>
          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
          <GeistText style={styles.optionLabel}>{item.label}</GeistText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <GeistText weight={500} style={styles.label}>
          {label}
        </GeistText>
      )}

      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        <GeistText
          style={[
            styles.selectorText,
            selectedLabels.length === 0 && styles.placeholderText,
          ]}
          numberOfLines={2}
        >
          {loading ? 'Загрузка...' : displayText}
        </GeistText>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#8E8E93"
          style={styles.chevron}
        />
      </TouchableOpacity>

      {error && error.length > 0 && (
        <GeistText style={styles.errorText}>{error[0]}</GeistText>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            {/* Header с поисковой строкой */}
            <View style={styles.modalHeader}>
              <GeistText weight={600} style={styles.modalTitle}>
                Выберите элементы
              </GeistText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>

            {/* Список опций */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
              style={styles.optionsList}
              ListEmptyComponent={
                <GeistText style={styles.emptyText}>
                  {loading ? 'Загрузка...' : 'Ничего не найдено'}
                </GeistText>
              }
            />

            {/* Кнопка Готово */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <GeistText weight={600} style={styles.doneText}>
                Готово
              </GeistText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#3C3C43',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectorError: {
    borderColor: '#FF3B30',
  },
  selectorText: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    marginRight: 8,
  },
  placeholderText: {
    color: '#8E8E93',
  },
  chevron: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
  },
  optionLabel: {
    fontSize: 15,
    color: '#000000',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#8E8E93',
    fontSize: 15,
  },
  doneButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  doneText: {
    fontSize: 17,
    color: '#007AFF',
  },
});

export default MultiSelectField;
