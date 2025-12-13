import { TextInput, StyleSheet, type TextInputProps } from 'react-native';

type Props = Omit<TextInputProps, 'style'> & {
  style?: object;
};

export const BareInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  ...rest
}: Props) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#8E8E93"
    keyboardType={keyboardType}
    multiline={multiline}
    numberOfLines={numberOfLines}
    textAlignVertical={multiline ? 'top' : 'center'}
    {...rest}
  />
);

const styles = StyleSheet.create({
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});