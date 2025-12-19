import React, { useCallback, ReactNode } from 'react';
import { StyleSheet, View, TouchableOpacity, BackHandler } from 'react-native';
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from './GeistText';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheetKeyboardAwareScrollView from '@/components/BottomSheetKeyboardAwareScrollView';

interface BottomSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  title?: string;
  children: ReactNode;
  snapPoints?: string[];
  onDismiss?: () => void;
}

const BottomSheet = ({
  sheetRef,
  title,
  children,
  snapPoints = ['70%'],
  onDismiss,
}: BottomSheetProps) => {
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
    [sheetRef]
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (sheetRef.current) {
          sheetRef.current.dismiss();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => subscription.remove();
    }, [sheetRef])
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      enableDismissOnClose={true}
      enableDynamicSizing={false}
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={onDismiss}
    >
      {/* Sticky Header */}
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

      {/* Scrollable content */}
      <BottomSheetKeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <View style={styles.childrenContainer}>{children}</View>
      </BottomSheetKeyboardAwareScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  childrenContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});

export default BottomSheet;
