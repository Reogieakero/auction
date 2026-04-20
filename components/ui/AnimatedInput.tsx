import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rightElement?: React.ReactNode;
}

export function AnimatedInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightElement,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Label: floats up when focused or has value
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  // Input text: slides in from left on focus
  const inputSlideAnim = useRef(new Animated.Value(value ? 0 : -16)).current;
  const inputOpacityAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  // Underline: expands from 0 to full width
  const underlineAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(inputSlideAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(inputOpacityAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(underlineAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.parallel([
        Animated.timing(labelAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: false,
        }),
        Animated.timing(inputSlideAnim, {
          toValue: -16,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(inputOpacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(underlineAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  // Label animates: from center-ish to top-left
  const labelTranslateY = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });
  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 11],
  });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.35)', isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'],
  });

  // Active underline width
  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View style={styles.container}>
        {/* Static base underline */}
        <View style={styles.underlineBase} />

        {/* Animated active underline */}
        <Animated.View style={[styles.underlineActive, { width: underlineWidth }]} />

        {/* Floating label */}
        <Animated.Text
          style={[
            styles.label,
            {
              transform: [{ translateY: labelTranslateY }],
              fontSize: labelFontSize,
              color: labelColor,
            },
          ]}
        >
          {label}
        </Animated.Text>

        {/* Input row */}
        <View style={styles.inputRow}>
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                opacity: inputOpacityAnim,
                transform: [{ translateX: inputSlideAnim }],
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              selectionColor="#FFFFFF"
              placeholderTextColor="transparent"
            />
          </Animated.View>
          {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingTop: 24,
    paddingBottom: 10,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: 30,
    left: 0,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 6,
    paddingRight: 0,
    letterSpacing: 0.2,
  },
  underlineBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  underlineActive: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 1,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  rightElement: {
    paddingLeft: 8,
  },
});