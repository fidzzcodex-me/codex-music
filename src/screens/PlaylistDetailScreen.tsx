import React, {useMemo} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChevronLeft, Trash2} from 'lucide-react-native';
import {colors, radii, spacing, typography} from '@theme/colors';
import TrackRow from '@components/TrackRow';
import {usePlaylists, removeTrackFromPlaylist} from '@store/usePlaylists';
import {useDownloads, removeDownload} from '@store/useDownloads';
import {useFavorites, toggleFavorite} from '@store/useFavorites';
import {playQueue} from '@store/usePlayer';
import {Track} from '@services/types';

type RouteParams = {
  type: 'playlist' | 'downloads';
  playlistId?: string;
  title: string;
};

export default function PlaylistDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {type, playlistId, title} = route.params as RouteParams;

  const playlists = usePlaylists();
  const downloads = useDownloads();
  const favorites = useFavorites();

  const tracks: Track[] = useMemo(() => {
    if (type === 'downloads') return downloads;
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    return playlist.trackIds
      .map(id => favorites.find(t => t.id === id) || downloads.find(t => t.id === id))
      .filter(Boolean) as Track[];
  }, [type, playlistId, playlists, downloads, favorites]);

  const handleRemove = (track: Track) => {
    if (type === 'downloads') {
      removeDownload(track);
    } else if (playlistId) {
      removeTrackFromPlaylist(playlistId, track.id);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + spacing.md}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={24} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={{width: 24}} />
      </View>

      <FlatList
        data={tracks}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Belum ada lagu di sini</Text>}
        renderItem={({item, index}) => (
          <TrackRow
            track={item}
            onPress={() => playQueue(tracks, index)}
            onToggleFavorite={() => toggleFavorite(item)}
            onMorePress={() => handleRemove(item)}
            isDownloaded={item.isDownloaded}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.ink,
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 60,
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    paddingTop: spacing.xl,
  },
});
