import { View, StyleSheet, Switch } from 'react-native';
import { GeistText } from '../GeistText';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  error?: string;
};

export const LabeledSwitch = ({
  label,
  value,
  onValueChange,
  disabled = false,
  error,
}: Props) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <GeistText
        weight={500}
        style={[styles.label, error && styles.labelError]}
      >
        {label}
      </GeistText>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: '#E5E5EA',
          true: '#007AFF',
        }}
        thumbColor="#FFFFFF"
      />
    </View>

    {error && <GeistText style={styles.errorText}>{error}</GeistText>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#3C3C43',
    marginRight: 12,
    flexShrink: 1,
  },
  labelError: {
    color: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
