import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
  RepeatMode,
} from 'react-native-track-player';

let isSetup = false;

export async function setupTrackPlayer(): Promise<void> {
  if (isSetup) return;

  await TrackPlayer.setupPlayer({
    autoHandleInterruptions: true,
  });

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.ContinuePlayback,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
      Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
    progressUpdateEventInterval: 1,
  });

  await TrackPlayer.setRepeatMode(RepeatMode.Off);

  isSetup = true;
}
