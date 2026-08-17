import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing, typography} from '@theme/colors';
import FadeInView from '@components/FadeInView';
import TrackRow from '@components/TrackRow';
import {useFavorites, toggleFavorite} from '@store/useFavorites';
import {playQueue} from '@store/usePlayer';
import {isDownloaded} from '@store/useDownloads';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const favorites = useFavorites();

  return (
    <View style={[styles.container, {paddingTop: insets.top + spacing.md}]}>
      <FadeInView>
        <Text style={styles.title}>Favorit</Text>
      </FadeInView>

      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada lagu favorit</Text>
        }
        renderItem={({item, index}) => (
          <FadeInView delay={Math.min(index * 40, 300)}>
            <TrackRow
              track={item}
              onPress={() => playQueue(favorites, index)}
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
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: 140,
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    paddingTop: spacing.xl,
  },
});
