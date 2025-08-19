import { useAudioPlayer, createAudioPlayer } from 'expo-audio';
import { Asset } from 'expo-asset';

/**
 * Audio utility helpers.
 *
 * El estado global `isSoundMuted` permite silenciar la aplicación sin tener que
 * poner el teléfono en silencio. Las funciones `setSoundMuted` y `getSoundMuted`
 * lo gestionan. Todos los sonidos respetan este estado.
 */

// Registro interno de URIs de sonidos generados/cargados
let soundURIs: { [key: string]: string } = {};
// Caché de players de audio
let globalPlayers: { [key: string]: any } = {};
// Flag global de mute
let isSoundMuted = false;

/** Cambia el estado global de mute. */
export const setSoundMuted = (muted: boolean) => {
  isSoundMuted = muted;
};
/** Devuelve si el sonido está silenciado. */
export const getSoundMuted = (): boolean => isSoundMuted;

/** Genera un tono WAV a partir de frecuencia y duración. */
const generateTone = (frequency: number, duration: number, volume: number = 0.3): string => {
  const sampleRate = 44100;
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * frequency * t) * volume * 32767;
    view.setInt16(44 + i * 2, sample, true);
  }
  return 'data:audio/wav;base64,' +
    btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
};

/** Precarga tonos y MP3 externos. */
export const loadSounds = async (): Promise<void> => {
  try {
    const diceRollTones = [
      generateTone(220, 0.1, 0.2),
      generateTone(261, 0.1, 0.2),
      generateTone(329, 0.1, 0.2),
      generateTone(392, 0.2, 0.15),
    ];
    soundURIs.diceRoll = diceRollTones[Math.floor(Math.random() * diceRollTones.length)];
    soundURIs.scoreSelect = generateTone(523, 0.2, 0.2);
    soundURIs.buttonPress = generateTone(800, 0.1, 0.15);

    const roundWinnerAsset = Asset.fromModule(require('../../assets/sounds/level-win.mp3'));
    const roundCompleteAsset = Asset.fromModule(require('../../assets/sounds/success.mp3'));
    const gameCompleteAsset = Asset.fromModule(require('../../assets/sounds/winner.mp3'));
    await roundWinnerAsset.downloadAsync();
    await roundCompleteAsset.downloadAsync();
    await gameCompleteAsset.downloadAsync();
    soundURIs.roundWinner = roundWinnerAsset.localUri || roundWinnerAsset.uri;
    soundURIs.roundComplete = roundCompleteAsset.localUri || roundCompleteAsset.uri;
    soundURIs.gameComplete = gameCompleteAsset.localUri || gameCompleteAsset.uri;
  } catch (error) {
    console.error('Error al generar los sonidos:', error);
  }
};

/** Libera players y URIs. */
export const unloadSounds = (): void => {
  Object.values(globalPlayers).forEach(player => player?.stop && player.stop());
  globalPlayers = {};
  soundURIs = {};
};

/** Configura el audio global (se mantiene por compatibilidad). */
export const configureAudio = async (): Promise<void> => {
  try {
    console.log('Audio configuration initialized');
  } catch (error) {
    console.error('Error configuring audio:', error);
  }
};

/** Reproduce un sonido salvo que esté silenciado. */
export const playSound = async (soundType: string): Promise<void> => {
  if (isSoundMuted) return;
  try {
    if (!soundURIs[soundType]) await loadSounds();
    if (!globalPlayers[soundType] && soundURIs[soundType]) {
      globalPlayers[soundType] = createAudioPlayer(soundURIs[soundType]);
    }
    const player = globalPlayers[soundType];
    if (player) {
      let volume = 0.7;
      switch (soundType) {
        case 'diceRoll': volume = 0.5; break;
        case 'scoreSelect': volume = 0.4; break;
        case 'roundWinner': volume = 0.8; break;
        case 'roundComplete': volume = 0.8; break;
        case 'gameComplete': volume = 0.9; break;
        case 'buttonPress': volume = 0.3; break;
      }
      player.volume = volume;
      player.seekTo(0);
      await player.play();
    }
  } catch (error) {
    console.error(`Error al reproducir el sonido ${soundType}:`, error);
  }
};

/** Hook para reproducir sonidos en componentes funcionales. */
export const useSounds = () => {
  const diceRollPlayer = useAudioPlayer(soundURIs.diceRoll || '');
  const scoreSelectPlayer = useAudioPlayer(soundURIs.scoreSelect || '');
  const roundWinnerPlayer = useAudioPlayer(soundURIs.roundWinner || '');
  const roundCompletePlayer = useAudioPlayer(soundURIs.roundComplete || '');
  const gameCompletePlayer = useAudioPlayer(soundURIs.gameComplete || '');
  const buttonPressPlayer = useAudioPlayer(soundURIs.buttonPress || '');

  const playSoundHook = async (soundType: string) => {
    if (isSoundMuted) return;
    let player;
    let volume = 0.7;
    switch (soundType) {
      case 'diceRoll': player = diceRollPlayer; volume = 0.5; break;
      case 'scoreSelect': player = scoreSelectPlayer; volume = 0.4; break;
      case 'roundWinner': player = roundWinnerPlayer; volume = 0.8; break;
      case 'roundComplete': player = roundCompletePlayer; volume = 0.8; break;
      case 'gameComplete': player = gameCompletePlayer; volume = 0.9; break;
      case 'buttonPress': player = buttonPressPlayer; volume = 0.3; break;
      default: return;
    }
    try {
      player.volume = volume;
      player.seekTo(0);
      await player.play();
    } catch (err) {
      console.error(`Error al reproducir el sonido ${soundType} desde hook:`, err);
    }
  };

  return { playSound: playSoundHook };
};