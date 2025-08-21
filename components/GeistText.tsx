import React from 'react';
import { Text, TextProps } from 'react-native';

type GeistWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

interface GeistTextProps extends TextProps {
  weight?: GeistWeight;
  children: React.ReactNode;
  numberOfLines?: number;
}

const fontMap: Record<GeistWeight, string> = {
  100: 'Geist-Thin', // not loaded for now
  200: 'Geist-ExtraLight', // not loaded for now
  300: 'Geist-Light',
  400: 'Geist-Regular',
  500: 'Geist-Medium',
  600: 'Geist-SemiBold',
  700: 'Geist-Bold',
  800: 'Geist-ExtraBold', // not loaded for now
  900: 'Geist-Black', // not loaded for now
};

export const GeistText = ({
  weight = 400,
  style,
  children,
  numberOfLines = 0,
  ...props
}: GeistTextProps) => {
  return (
    <Text
      {...props}
      style={[{ fontFamily: fontMap[weight] }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};