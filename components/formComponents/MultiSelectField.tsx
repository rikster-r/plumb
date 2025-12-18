import React, { useRef, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '../GeistText';
import BottomSheet from '../BottomSheet';

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
  emptyStateText?: string;
}

const MultiSelectField = ({
  label,
  options,
  selectedValues,
  onValueChange,
  placeholder = 'Выберите элементы',
  error,
  loading = false,
  emptyStateText = 'Ничего не найдено',
}: MultiSelectFieldProps) => {
  const sheetRef = useRef<null | any>(null);

  const selectedLabels = useMemo(
    () =>
      options
        .filter((opt) => selectedValues.includes(opt.value))
        .map((o) => o.label),
    [options, selectedValues]
  );

  const displayText =
    selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;

  return (
    <View style={styles.container}>
      {label && (
        <GeistText weight={500} style={styles.label}>
          {label}
        </GeistText>
      )}

      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => sheetRef.current?.present()}
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

      <BottomSheet
        sheetRef={sheetRef}
        title="Выберите элементы"
        snapPoints={['70%']}
      >
        {options.length === 0 ? (
          <GeistText style={styles.emptyText}>
            {loading ? 'Загрузка...' : emptyStateText}
          </GeistText>
        ) : (
          options.map((item) => {
            const isSelected = selectedValues.includes(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                style={styles.optionItem}
                onPress={() => {
                  if (isSelected) {
                    onValueChange(
                      selectedValues.filter((v) => v !== item.value)
                    );
                  } else {
                    onValueChange([...selectedValues, item.value]);
                  }
                }}
              >
                <View style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <GeistText style={styles.optionLabel}>{item.label}</GeistText>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 15, color: '#3C3C43', marginBottom: 8 },
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
  selectorError: { borderColor: '#FF3B30' },
  selectorText: { flex: 1, fontSize: 15, color: '#000', marginRight: 8 },
  placeholderText: { color: '#8E8E93' },
  chevron: { marginLeft: 8 },
  errorText: { fontSize: 13, color: '#FF3B30', marginTop: 6 },
  optionsList: { maxHeight: 400 },
  optionItem: { paddingVertical: 14 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
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
  checkboxSelected: { backgroundColor: '#007AFF' },
  optionLabel: { fontSize: 15, color: '#000' },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#8E8E93',
    fontSize: 15,
  },
});

export default MultiSelectField;
