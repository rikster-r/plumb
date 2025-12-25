import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { GeistText } from '../GeistText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  stickToBottom?: boolean;
};

export const FormActions = ({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitText = 'Создать',
  cancelText = 'Отмена',
  stickToBottom = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  const actions = (
    <KeyboardStickyView style={styles.actions}>
      <TouchableOpacity
        style={styles.cancel}
        onPress={onCancel}
        activeOpacity={0.7}
      >
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
    </KeyboardStickyView>
  );

  if (!stickToBottom) {
    return <View style={{ paddingBottom: insets.bottom + 12 }}>{actions}</View>;
  }

  return (
    <View style={[styles.stickyWrapper, { paddingBottom: insets.bottom + 12 }]}>
      {actions}
    </View>
  );
};

const styles = StyleSheet.create({
  stickyWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    maxHeight: 80,
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
