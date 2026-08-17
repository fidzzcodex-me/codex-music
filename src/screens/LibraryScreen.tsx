import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Plus, ListMusic, Download, ChevronRight} from 'lucide-react-native';
import {colors, radii, spacing, typography} from '@theme/colors';
import FadeInView from '@components/FadeInView';
import {usePlaylists, createPlaylist} from '@store/usePlaylists';
import {useDownloads} from '@store/useDownloads';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const playlists = usePlaylists();
  const downloads = useDownloads();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPlaylist(newName.trim());
    setNewName('');
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + spacing.md}]}>
      <FadeInView>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Library</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </FadeInView>

      <FadeInView delay={60}>
        <TouchableOpacity
          style={styles.downloadCard}
          onPress={() =>
            navigation.navigate('PlaylistDetail', {
              type: 'downloads',
              title: 'Musik Terunduh',
            })
          }>
          <View style={styles.downloadIconWrap}>
            <Download size={20} color={colors.white} />
          </View>
          <View style={styles.downloadInfo}>
            <Text style={styles.downloadTitle}>Musik Terunduh</Text>
            <Text style={styles.downloadSubtitle}>{downloads.length} lagu tersimpan</Text>
          </View>
          <ChevronRight size={20} color={colors.muted} />
        </TouchableOpacity>
      </FadeInView>

      <Text style={styles.sectionLabel}>Playlist Kamu</Text>

      <FlatList
        data={playlists}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada playlist. Buat satu yuk!</Text>
        }
        renderItem={({item, index}) => (
          <FadeInView delay={Math.min(index * 50, 300)}>
            <TouchableOpacity
              style={styles.playlistRow}
              onPress={() =>
                navigation.navigate('PlaylistDetail', {
                  type: 'playlist',
                  playlistId: item.id,
                  title: item.name,
                })
              }>
              <View style={styles.playlistIconWrap}>
                <ListMusic size={20} color={colors.primary} />
              </View>
              <View style={styles.downloadInfo}>
                <Text style={styles.downloadTitle}>{item.name}</Text>
                <Text style={styles.downloadSubtitle}>{item.trackIds.length} lagu</Text>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
          </FadeInView>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Playlist Baru</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Nama playlist"
              placeholderTextColor={colors.muted}
              style={styles.modalInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonGhostText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCreate}>
                <Text style={styles.modalButtonText}>Buat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.ink,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  downloadIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadInfo: {
    flex: 1,
  },
  downloadTitle: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  downloadSubtitle: {
    ...typography.small,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  sectionLabel: {
    ...typography.h3,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: 140,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  playlistIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    paddingTop: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  modalInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 46,
    ...typography.body,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonGhost: {
    backgroundColor: colors.surfaceSoft,
  },
  modalButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  modalButtonGhostText: {
    ...typography.bodyMedium,
    color: colors.ink,
  },
});
