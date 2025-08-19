import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GameHistoryEntry } from '../types';

const GAME_STATE_KEY = 'gameState';
const GAME_HISTORY_KEY = 'gameHistory';

export const saveGameState = async (state: GameState) => {
  try {
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state', e);
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const json = await AsyncStorage.getItem(GAME_STATE_KEY);
    return json ? (JSON.parse(json) as GameState) : null;
  } catch (e) {
    console.error('Failed to load game state', e);
    return null;
  }
};

/** NUEVO: comprueba si existe estado guardado */
export const hasSavedGameState = async (): Promise<boolean> => {
  try {
    const json = await AsyncStorage.getItem(GAME_STATE_KEY);
    return !!json;
  } catch (e) {
    console.error('Failed to check saved game state', e);
    return false;
  }
};

export const clearGameState = async () => {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
  } catch (e) {
    console.error('Failed to clear game state', e);
  }
};

export const saveGameResult = async (result: GameHistoryEntry) => {
  try {
    const json = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    const history = json ? (JSON.parse(json) as GameHistoryEntry[]) : [];

    const sortedPlayers = result.players
      .slice()
      .sort((a, b) => b.totalScore - a.totalScore);

    history.push({ ...result, players: sortedPlayers });
    await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save game result', e);
  }
};

export const loadGameHistory = async (): Promise<GameHistoryEntry[]> => {
  try {
    const json = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    return json ? (JSON.parse(json) as GameHistoryEntry[]) : [];
  } catch (e) {
    console.error('Failed to load game history', e);
    return [];
  }
};
