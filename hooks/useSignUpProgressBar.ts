import { useEffect, useRef } from 'react';
import { Animated, LayoutAnimation } from 'react-native';

export const useSignUpProgressBar = (password: string, showConfirmStep: boolean) => {
  const progressBarWidth = useRef(new Animated.Value(0.5)).current;
  const confirmAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (password.length > 0 && !showConfirmStep) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.parallel([
        Animated.spring(confirmAnim, { toValue: 1, useNativeDriver: true }),
        Animated.timing(progressBarWidth, { toValue: 1, duration: 400, useNativeDriver: false }),
      ]).start();
    }
  }, [password, showConfirmStep, confirmAnim, progressBarWidth]);

  return {
    progressBarWidth,
    confirmAnim,
  };
};
