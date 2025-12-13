// components/FormActions.tsx
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { GeistText } from '../GeistText';

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
};

export const FormActions = ({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitText = 'Создать',
  cancelText = 'Отмена',
}: Props) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.cancel} onPress={onCancel} activeOpacity={0.7}>
      <GeistText weight={600} style={styles.cancelText}>
        {cancelText}
      </GeistText>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.submit, isSubmitting && styles.submitDisabled]}
      onPress={onSubmit}
      disabled={isSubmitting}
      activeOpacity={0.7}
    >
      {isSubmitting ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <GeistText weight={600} style={styles.submitText}>
          {submitText}
        </GeistText>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancel: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#000000',
  },
  submit: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});