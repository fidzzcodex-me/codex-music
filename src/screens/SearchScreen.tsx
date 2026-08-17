import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchIcon, X, Sparkles} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import {colors, radii, spacing, typography} from '@theme/colors';
import ParticleBackground from '@components/ParticleBackground';
import FadeInView from '@components/FadeInView';
import TrackRow from '@components/TrackRow';
import {searchTracks, tidFromUrl} from '@services/api';
import {durationStringToSeconds, Track} from '@services/types';
import {playQueue} from '@store/usePlayer';
import {toggleFavorite} from '@store/useFavorites';
import {isDownloaded} from '@store/useDownloads';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const items = await searchTracks(text);
      const tracks: Track[] = items.map(item => ({
        id: tidFromUrl(item.spotifyUrl),
        title: item.name,
        artist: item.artist,
        album: item.album,
        artwork: item.cover,
        duration: durationStringToSeconds(item.duration),
        spotifyUrl: item.spotifyUrl,
      }));
      setResults(tracks);
    } catch (e) {
      Toast.show({type: 'error', text1: 'Gagal mencari lagu', text2: 'Coba lagi sebentar'});
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = () => runSearch(query);

  const handlePlay = async (track: Track, index: number) => {
    try {
      await playQueue(results, index);
    } catch (e) {
      Toast.show({type: 'error', text1: 'Gagal memutar lagu'});
    }
  };

  return (
    <View style={styles.container}>
      <ParticleBackground count={16} />
      <View style={[styles.header, {paddingTop: insets.top + spacing.md}]}>
        <FadeInView>
          <View style={styles.titleRow}>
            <View style={styles.logoBadge}>
              <Sparkles size={20} color={colors.white} />
            </View>
            <Text style={styles.title}>FidzzMusic</Text>
          </View>
        </FadeInView>

        <FadeInView delay={80}>
          <View style={styles.searchBar}>
            <SearchIcon size={18} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              placeholder="Cari judul lagu atau artis..."
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setQuery('');
                  setResults([]);
                }}
                hitSlop={8}>
                <X size={18} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        </FadeInView>
      </View>

      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {!loading && results.length === 0 && (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            {query ? 'Tidak ada hasil ditemukan' : 'Cari lagu favoritmu di sini'}
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({item, index}) => (
          <FadeInView delay={Math.min(index * 40, 300)}>
            <TrackRow
              track={item}
              onPress={() => handlePlay(item, index)}
              onToggleFavorite={() => toggleFavorite(item)}
              isDownloaded={isDownloaded(item.id)}
            />
          </FadeInView>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.ink,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.ink,
  },
  loadingWrap: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  emptyWrap: {
    paddingTop: spacing.xl,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: 140,
  },
});
