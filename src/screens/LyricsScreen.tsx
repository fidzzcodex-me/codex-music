import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChevronDown} from 'lucide-react-native';
import {colors, spacing, typography} from '@theme/colors';
import {fetchLyrics, LyricLine} from '@services/lyrics';
import {useProgress} from '@store/usePlayer';

type RouteParams = {
  title: string;
  artist: string;
  duration: number;
};

export default function LyricsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {title, artist, duration} = route.params as RouteParams;
  const progress = useProgress();

  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState<LyricLine[] | null>(null);
  const [plain, setPlain] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(-1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchLyrics(title, artist, duration).then(result => {
      if (!mounted) return;
      setSynced(result.synced);
      setPlain(result.plain);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [title, artist, duration]);

  useEffect(() => {
    if (!synced || synced.length === 0) return;
    let activeIndex = -1;
    for (let i = 0; i < synced.length; i++) {
      if (synced[i].time <= progress.position) activeIndex = i;
      else break;
    }
    if (activeIndex !== activeIndexRef.current && activeIndex >= 0) {
      activeIndexRef.current = activeIndex;
      scrollRef.current?.scrollTo({
        y: Math.max(0, activeIndex * 44 - 160),
        animated: true,
      });
    }
  }, [progress.position, synced]);

  return (
    <View style={[styles.container, {paddingTop: insets.top + spacing.md}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronDown size={24} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerArtist} numberOfLines={1}>
            {artist}
          </Text>
        </View>
        <View style={{width: 24}} />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {!loading && !synced && !plain && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Lirik tidak ditemukan untuk lagu ini</Text>
        </View>
      )}

      {!loading && synced && synced.length > 0 && (
        <ScrollView ref={scrollRef} contentContainerStyle={styles.lyricsContent}>
          {synced.map((line, i) => {
            const isActive = i === activeIndexRef.current;
            return (
              <Text
                key={`${line.time}-${i}`}
                style={[styles.lyricLine, isActive && styles.lyricLineActive]}>
                {line.text || '...'}
              </Text>
            );
          })}
        </ScrollView>
      )}

      {!loading && !synced && plain && (
        <ScrollView contentContainerStyle={styles.lyricsContent}>
          <Text style={styles.plainLyrics}>{plain}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.bodyMedium,
    color: colors.ink,
  },
  headerArtist: {
    ...typography.small,
    color: colors.muted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
  lyricsContent: {
    paddingBottom: 200,
  },
  lyricLine: {
    ...typography.h3,
    color: colors.muted,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  lyricLineActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  plainLyrics: {
    ...typography.body,
    color: colors.ink,
    lineHeight: 26,
  },
});
