import React, {useEffect, useMemo} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {colors} from '@theme/colors';

interface ParticleProps {
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
}

function Particle({size, startX, startY, duration, delay}: ParticleProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-40, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(0.4, {duration: duration * 0.8, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [delay, duration, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: startX,
          top: startY,
        },
        style,
      ]}
    />
  );
}

export default function ParticleBackground({count = 18}: {count?: number}) {
  const {width, height} = useWindowDimensions();

  const particles = useMemo(
    () =>
      Array.from({length: count}).map((_, i) => ({
        key: i,
        size: 2 + Math.random() * 4,
        startX: Math.random() * width,
        startY: Math.random() * height * 0.7,
        duration: 3000 + Math.random() * 4000,
        delay: Math.random() * 2000,
      })),
    [count, width, height],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map(p => (
        <Particle key={p.key} {...p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    backgroundColor: colors.primaryLight,
  },
});
