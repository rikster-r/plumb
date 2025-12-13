// components/CheckboxField.tsx
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '../GeistText';

type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export const CheckboxField = ({ label, checked, onToggle }: Props) => (
  <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
    <View style={[styles.checkbox, checked && styles.checked]}>
      {checked && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
    </View>
    <GeistText weight={400} style={styles.label}>
      {label}
    </GeistText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  label: {
    fontSize: 16,
    color: '#000000',
  },
});