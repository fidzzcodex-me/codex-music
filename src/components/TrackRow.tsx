import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Play, Heart, MoreVertical, Download, Check} from 'lucide-react-native';
import {colors, radii, spacing, typography} from '@theme/colors';
import {Track} from '@services/types';
import {useIsFavorite} from '@store/useFavorites';

interface TrackRowProps {
  track: Track;
  onPress: () => void;
  onToggleFavorite?: () => void;
  onMorePress?: () => void;
  isDownloaded?: boolean;
  isActive?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrackRow({
  track,
  onPress,
  onToggleFavorite,
  onMorePress,
  isDownloaded,
  isActive,
}: TrackRowProps) {
  const favorite = useIsFavorite(track.id);

  return (
    <TouchableOpacity
      style={[styles.row, isActive && styles.rowActive]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.artworkWrap}>
        <FastImage
          source={{uri: track.artwork}}
          style={styles.artwork}
          resizeMode={FastImage.resizeMode.cover}
        />
        {isActive && (
          <View style={styles.playingOverlay}>
            <Play size={16} color={colors.white} fill={colors.white} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>

      <View style={styles.meta}>
        {isDownloaded && (
          <View style={styles.downloadedBadge}>
            <Check size={12} color={colors.primary} />
          </View>
        )}
        <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
        {onToggleFavorite && (
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={8}>
            <Heart
              size={18}
              color={favorite ? colors.primary : colors.muted}
              fill={favorite ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        )}
        {onMorePress && (
          <TouchableOpacity onPress={onMorePress} hitSlop={8}>
            <MoreVertical size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  rowActive: {
    backgroundColor: colors.surfaceSoft,
  },
  artworkWrap: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  artwork: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSoft,
  },
  playingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.ink,
  },
  subtitle: {
    ...typography.small,
    color: colors.muted,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  downloadedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    ...typography.tiny,
    color: colors.muted,
    minWidth: 34,
    textAlign: 'right',
  },
});
