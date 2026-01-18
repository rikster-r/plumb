import BottomSheetKeyboardAwareScrollView from '@/components/BottomSheetKeyboardAwareScrollView';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { ReactNode, useCallback, useState } from 'react';
import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FormActions } from './formComponents';
import { GeistText } from './GeistText';

interface BottomSheetFormProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  title?: string;
  children: ReactNode;
  snapPoints?: string[];
  onDismiss: () => void;

  handleFormSubmit: () => void;
  isFormSubmitting: boolean;
  submitText: string;
  cancelText: string;
}

const ACTIONS_HEIGHT = 72;

const BottomSheetForm = ({
  sheetRef,
  title,
  children,
  snapPoints = ['90%'],
  onDismiss,
  handleFormSubmit,
  isFormSubmitting,
  submitText,
  cancelText,
}: BottomSheetFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => sheetRef.current?.dismiss()}
        style={[StyleSheet.absoluteFill, props.style]}
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      </TouchableOpacity>
    ),
    [sheetRef],
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isOpen) {
          sheetRef.current?.dismiss();
          return true; // consume back to close sheet
        }
        return false; // allow navigation back normally
      };

      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => sub.remove();
    }, [isOpen, sheetRef]),
  );

  const handleSheetPositionChange = useCallback((position: number) => {
    setIsOpen(position === 0);
  }, []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={onDismiss}
      onChange={handleSheetPositionChange}
    >
      {/* Header */}
      <View style={styles.header}>
        {title && (
          <GeistText style={styles.title} weight={600}>
            {title}
          </GeistText>
        )}
        <TouchableOpacity onPress={() => sheetRef.current?.dismiss()}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Scrollable form */}
      <BottomSheetKeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        bottomOffset={ACTIONS_HEIGHT}
      >
        {children}
      </BottomSheetKeyboardAwareScrollView>

      {/* Fixed actions */}
      <View style={styles.actionsContainer}>
        <FormActions
          onCancel={onDismiss}
          onSubmit={handleFormSubmit}
          isSubmitting={isFormSubmitting}
          submitText={submitText}
          cancelText={cancelText}
        />
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: '#ddd',
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
});

export default BottomSheetForm;
