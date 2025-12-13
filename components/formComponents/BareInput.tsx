import React, { useState } from 'react';
import { View, TextInput, StyleSheet, type TextInputProps } from 'react-native';

type Props = Omit<TextInputProps, 'style'> & {
  style?: object;
  containerStyle?: object;
  maxHeight?: number;
  numberOfLines?: number;
};

export const BareInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  maxHeight = 120,
  ...rest
}: Props) => {

  return (
    <View style={styles.container}>
      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          { height: numberOfLines > 1 ? numberOfLines * 30 : 48, maxHeight },
          style,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
