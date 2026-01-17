/**
 * MEANLY - Safe Area Wrapper Component
 * Wrapper with safe area insets and optional keyboard avoiding
 */

import React, { memo, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '../../constants/colors';

interface SafeAreaWrapperProps {
  children: ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
  keyboardAvoiding?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SafeAreaWrapper = memo(function SafeAreaWrapper({
  children,
  edges = ['top', 'bottom'],
  backgroundColor = Colors.background,
  keyboardAvoiding = false,
  style,
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  const content = (
    <View style={[styles.container, { backgroundColor }, paddingStyle, style]}>
      {children}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
