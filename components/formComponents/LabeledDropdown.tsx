import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useState } from 'react';
import { GeistText } from '../GeistText';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value: string;
  onChangeValue: (value: string) => void;
  options: Option[];
  placeholder?: string;
  style?: object;
  error?: string;
};

export const LabeledDropdown = ({
  label,
  value,
  onChangeValue,
  options,
  placeholder = 'Выберите вариант',
  style,
  error,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <View style={styles.container}>
      <GeistText
        weight={500}
        style={[styles.label, error && styles.labelError]}
      >
        {label}
      </GeistText>

      <TouchableOpacity
        style={[styles.dropdown, style, error && styles.dropdownError]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <GeistText
          style={[
            styles.dropdownText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {displayText}
        </GeistText>
        <GeistText style={styles.arrow}>▼</GeistText>
      </TouchableOpacity>

      {error && <GeistText style={styles.errorText}>{error}</GeistText>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onChangeValue(item.value);
                    setIsOpen(false);
                  }}
                >
                  <GeistText
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </GeistText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 8,
  },
  labelError: {
    color: '#FF3B30',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dropdownError: {
    borderColor: '#FF3B30',
  },
  dropdownText: {
    fontSize: 16,
    color: '#3C3C43',
    flex: 1,
  },
  placeholderText: {
    color: '#8E8E93',
  },
  arrow: {
    fontSize: 10,
    color: '#8E8E93',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  selectedOption: {
    backgroundColor: '#F2F2F7',
  },
  optionText: {
    fontSize: 16,
    color: '#3C3C43',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#007AFF',
  },
});
