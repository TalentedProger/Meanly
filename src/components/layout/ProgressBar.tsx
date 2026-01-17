/**
 * MEANLY - Progress Bar Component
 * Animated progress bar with step indicators
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '../common/Text';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  steps?: number;
  currentStep?: number;
  showLabel?: boolean;
  color?: string;
  height?: number;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar = memo(function ProgressBar({
  progress,
  steps,
  currentStep,
  showLabel = false,
  color = Colors.primary,
  height = 6,
  animated = true,
  style,
}: ProgressBarProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withSpring(progress, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, Math.max(0, animatedProgress.value))}%`,
  }));

  // Calculate progress from steps if provided
  const calculatedProgress = steps && currentStep !== undefined
    ? ((currentStep - 1) / (steps - 1)) * 100
    : progress;

  return (
    <View style={[styles.container, style]}>
      {/* Progress Track */}
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: color, height },
            animatedStyle,
          ]}
        />

        {/* Step Indicators */}
        {steps && (
          <View style={styles.stepsContainer}>
            {Array.from({ length: steps }).map((_, index) => {
              const stepProgress = (index / (steps - 1)) * 100;
              const isCompleted = calculatedProgress >= stepProgress;
              const isCurrent = currentStep === index + 1;

              return (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    isCompleted && { backgroundColor: color },
                    isCurrent && styles.stepCurrent,
                    { left: `${stepProgress}%` },
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>

      {/* Label */}
      {showLabel && (
        <View style={styles.labelContainer}>
          {steps && currentStep ? (
            <Text variant="caption" color={Colors.gray500}>
              Шаг {currentStep} из {steps}
            </Text>
          ) : (
            <Text variant="caption" color={Colors.gray500}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  track: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
  stepsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stepDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray300,
    top: '50%',
    marginTop: -6,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  stepCurrent: {
    transform: [{ scale: 1.2 }],
  },
  labelContainer: {
    alignItems: 'center',
  },
});

export default ProgressBar;
