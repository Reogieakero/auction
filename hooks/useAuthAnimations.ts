import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useAuthAnimations = () => {
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const slideTitle = useRef(new Animated.Value(24)).current;
  const fadeForm = useRef(new Animated.Value(0)).current;
  const slideForm = useRef(new Animated.Value(32)).current;
  const fadeFooter = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeTitle, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideTitle, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeForm, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideForm, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.timing(fadeFooter, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [fadeTitle, slideTitle, fadeForm, slideForm, fadeFooter]);

  const animateButton = (toValue: number) => {
    Animated.spring(btnScale, {
      toValue,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return {
    fadeTitle,
    slideTitle,
    fadeForm,
    slideForm,
    fadeFooter,
    btnScale,
    animateButton,
  };
};
