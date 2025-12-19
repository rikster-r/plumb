import { View, StyleSheet } from 'react-native';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const FormRow = ({ children }: Props) => (
  <View style={styles.row}>
    {React.Children.map(children, (child) => (
      <View style={styles.item}>{child}</View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  item: {
    flex: 1,
  },
});
