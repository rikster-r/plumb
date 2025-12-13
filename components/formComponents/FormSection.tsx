// components/FormSection.tsx
import { View, StyleSheet } from 'react-native';
import { GeistText } from '../GeistText';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const FormSection = ({ title, children }: Props) => (
  <>
    <GeistText weight={600} style={styles.title}>
      {title}
    </GeistText>
    <View>{children}</View>
  </>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 16,
    marginTop: 8,
  },
});
