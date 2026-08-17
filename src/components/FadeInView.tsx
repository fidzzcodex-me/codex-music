import React, {useEffect} from 'react';
import {ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
  direction?: 'up' | 'down' | 'none';
}

export default function FadeInView({
  children,
  delay = 0,
  style,
  direction = 'up',
}: FadeInViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(direction === 'up' ? 16 : direction === 'down' ? -16 : 0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, {duration: 420, easing: Easing.out(Easing.cubic)}));
    translateY.value = withDelay(delay, withTiming(0, {duration: 420, easing: Easing.out(Easing.cubic)}));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
