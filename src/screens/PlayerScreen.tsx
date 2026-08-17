import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {
  ChevronDown,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Download,
  Check,
  Mic2,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import {colors, radii, spacing, typography} from '@theme/colors';
import {
  useActiveTrack,
  usePlayerState,
  useProgress,
  togglePlayPause,
  skipNext,
  skipPrevious,
  seekTo,
} from '@store/usePlayer';
import {useIsFavorite, toggleFavorite} from '@store/useFavorites';
import {isDownloaded, downloadTrack} from '@store/useDownloads';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const track = useActiveTrack();
  const {isPlaying, isBuffering} = usePlayerState();
  const progress = useProgress();
  const favorite = useIsFavorite(track?.id ?? '');
  const [downloading, setDownloading] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);

  if (!track) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tidak ada lagu yang diputar</Text>
      </View>
    );
  }

  const downloaded = isDownloaded(track.id);

  const handleDownload = async () => {
    if (downloaded || downloading) return;
    setDownloading(true);
    try {
      await downloadTrack(track, setDownloadPercent);
      Toast.show({type: 'success', text1: 'Lagu berhasil diunduh'});
    } catch (e) {
      Toast.show({type: 'error', text1: 'Gagal mengunduh lagu'});
    } finally {
      setDownloading(false);
      setDownloadPercent(0);
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientEnd, colors.ink]}
      style={[styles.container, {paddingTop: insets.top + spacing.md}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronDown size={26} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Sedang Diputar</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Lyrics', {
              title: track.title,
              artist: track.artist,
              duration: track.duration,
            })
          }
          hitSlop={8}>
          <Mic2 size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.artworkWrap}>
        <FastImage source={{uri: track.artwork}} style={styles.artwork} />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(track)} hitSlop={8}>
          <Heart
            size={24}
            color={favorite ? colors.primaryLight : colors.white}
            fill={favorite ? colors.primaryLight : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={progress.duration || track.duration}
        value={progress.position}
        minimumTrackTintColor={colors.primaryLight}
        maximumTrackTintColor="rgba(255,255,255,0.25)"
        thumbTintColor={colors.white}
        onSlidingComplete={seekTo}
      />

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
        <Text style={styles.timeText}>{formatTime(progress.duration || track.duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={skipPrevious} hitSlop={12}>
          <SkipBack size={28} color={colors.white} fill={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          {isBuffering ? (
            <ActivityIndicator color={colors.ink} />
          ) : isPlaying ? (
            <Pause size={30} color={colors.ink} fill={colors.ink} />
          ) : (
            <Play size={30} color={colors.ink} fill={colors.ink} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={skipNext} hitSlop={12}>
          <SkipForward size={28} color={colors.white} fill={colors.white} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownload}
        disabled={downloaded || downloading}>
        {downloaded ? (
          <>
            <Check size={18} color={colors.primaryLight} />
            <Text style={styles.downloadText}>Sudah diunduh</Text>
          </>
        ) : downloading ? (
          <>
            <ActivityIndicator size="small" color={colors.white} />
            <Text style={styles.downloadText}>Mengunduh {downloadPercent}%</Text>
          </>
        ) : (
          <>
            <Download size={18} color={colors.white} />
            <Text style={styles.downloadText}>Unduh lagu ini</Text>
          </>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
  },
  emptyText: {
    ...typography.body,
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerLabel: {
    ...typography.small,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  artworkWrap: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoText: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.white,
  },
  artist: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  timeText: {
    ...typography.tiny,
    color: 'rgba(255,255,255,0.6)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.pill,
    height: 46,
    marginBottom: spacing.lg,
  },
  downloadText: {
    ...typography.bodyMedium,
    color: colors.white,
  },
});
