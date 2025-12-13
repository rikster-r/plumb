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
}: Props) => (
  <View style={styles.container}>
    <GeistText weight={500} style={styles.label}>
      {label}
    </GeistText>
    <BareInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={style}
    />
  </View>
);

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
});