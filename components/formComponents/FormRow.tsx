// components/FormRow.tsx
import { View, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export const FormRow = ({ children }: Props) => (
  <View style={styles.row}>{children}</View>
);

const styles = StyleSheet.create({
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
});
