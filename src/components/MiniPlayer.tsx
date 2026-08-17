import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {Play, Pause, SkipForward} from 'lucide-react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {colors, radii, spacing, typography} from '@theme/colors';
import {useActiveTrack, usePlayerState, useProgress, togglePlayPause, skipNext} from '@store/usePlayer';

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  const track = useActiveTrack();
  const {isPlaying, isBuffering} = usePlayerState();
  const progress = useProgress();

  if (!track) return null;

  const percent = progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0;

  return (
    <Animated.View entering={FadeInDown.duration(320)} style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Player')}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${percent}%`}]} />
        </View>
        <View style={styles.content}>
          <FastImage source={{uri: track.artwork}} style={styles.artwork} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {track.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {track.artist}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={togglePlayPause}
            hitSlop={8}>
            {isPlaying ? (
              <Pause size={20} color={colors.white} fill={colors.white} />
            ) : (
              <Play size={20} color={colors.white} fill={colors.white} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={skipNext} hitSlop={8}>
            <SkipForward size={20} color={colors.white} fill={colors.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  container: {
    backgroundColor: colors.ink,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.primaryLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSoft,
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  artist: {
    ...typography.tiny,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
