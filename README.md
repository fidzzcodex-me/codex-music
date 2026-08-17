# FidzzMusic

Music streaming app dengan background playback (kayak Spotify), search via Spotify API, playlist/favorit lokal, lyrics sync, dan download offline.

**Package:** `com.codex.music`
**Stack:** React Native 0.74 (bare, bukan Expo) + TypeScript + react-native-track-player

---

## Fitur

- 🔍 Search lagu (via `me.fidzzcodex.my.id`)
- ▶️ Background audio playback + kontrol di notification bar/lockscreen
- ❤️ Favorit lokal
- 📁 Playlist custom
- 🎤 Lyrics sync otomatis (dari LRCLIB, gratis)
- ⬇️ Download lagu buat diputar offline
- 🎨 Desain blue/white soft, particle animation, full rounded, Lucide icons

---

## Build APK via GitHub Actions (Cara Utama)

1. Push repo ini ke GitHub.
2. Buka tab **Actions** di repo → workflow **"Build Android APK"** akan otomatis jalan tiap push ke `main`, atau trigger manual lewat **Run workflow**.
3. Setelah selesai (~5-10 menit), APK bisa diambil di:
   - Tab **Actions** → pilih run terakhir → bagian **Artifacts** → `FidzzMusic-release-apk`
   - Atau di tab **Releases** (otomatis dibuatkan release baru tiap build)

Workflow ini men-generate `gradle-wrapper.jar` otomatis di CI (karena file binary itu sengaja tidak di-commit), lalu build APK release yang di-sign pakai debug keystore auto-generate.

> ⚠️ **Catatan soal signing:** APK yang dihasilkan disign pakai debug keystore (auto-generate tiap build). Ini cukup untuk install & testing manual, TAPI **tidak valid untuk upload ke Google Play Store**. Kalau nanti mau publish ke Play Store, perlu keystore asli + setup GitHub Secrets (`FIDZZMUSIC_UPLOAD_STORE_FILE`, dll — lihat `android/app/build.gradle` bagian `signingConfigs.release`).

---

## Build Lokal (opsional, kalau punya Android Studio/SDK)

```bash
npm install
cd android
./gradlew assembleRelease
```

APK ada di `android/app/build/outputs/apk/release/app-release.apk`

---

## Struktur Project

```
src/
  screens/       -> Search, Library, Favorites, Player, Lyrics, PlaylistDetail
  components/     -> TrackRow, MiniPlayer, ParticleBackground, FadeInView
  services/       -> api.ts (search/download), lyrics.ts, storage.ts, PlaybackService.ts
  store/          -> useFavorites, usePlaylists, useDownloads, usePlayer
  navigation/      -> RootNavigator (bottom tabs + modal stack)
  theme/          -> colors.ts (design system)
android/          -> native Android project (Kotlin)
.github/workflows/ -> CI build config
```

## API yang dipakai

- **Search & Download:** `https://me.fidzzcodex.my.id` (search/download Spotify)
- **Lyrics:** `https://lrclib.net` (gratis, tanpa API key)

## Known limitations

- Lyrics tidak selalu ketemu untuk semua lagu (tergantung database LRCLIB)
- Kualitas audio & keandalan stream tergantung sepenuhnya API pihak ketiga di atas
- Icon app masih placeholder vector sederhana — ganti PNG asli di `android/app/src/main/res/mipmap-*` kalau mau custom
