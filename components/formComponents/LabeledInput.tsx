import { View, StyleSheet } from 'react-native';
import { GeistText } from '../GeistText';
import { BareInput } from './BareInput';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'phone-pad' | 'email-address';
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
  error?: string;
};

export const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  error,
}: Props) => (
  <View style={styles.container}>
    <GeistText weight={500} style={[styles.label, error && styles.labelError]}>
      {label}
    </GeistText>
    <BareInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      maxHeight={numberOfLines > 1 ? undefined : 120}
      style={[style, error && styles.inputError]}
    />
    {error && (
      <GeistText style={styles.errorText}>
        {error}
      </GeistText>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexGrow: 1
  },
  label: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 8,
  },
  labelError: {
    color: '#FF3B30',
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
});