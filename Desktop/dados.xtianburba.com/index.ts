import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

export interface Player {
  id: number;
  name: string;
}

export interface ScoreEntry {
  value: number | null;
  filled: boolean;
}

export interface PlayerScore {
  playerId: number;
  scores: {
    // Primera partida (libre)
    round1: {
      [key: string]: ScoreEntry;
    };
    // Segunda partida (forzada por fila)
    round2: {
      [key: string]: ScoreEntry;
    };
  };
  totalScore?: number;
}

export type GamePhase = 'round1' | 'round2' | 'finished';

export interface GameState {
  players: Player[];
  scores: PlayerScore[];
  currentPhase: GamePhase;
  currentPlayerIndex: number;
  currentRow?: string;
}

export interface PlayerHistory {
  name: string;
  round1Score: number;
  round2Score: number;
  totalScore: number;
}

export interface GameHistoryEntry {
  date: string;
  players: PlayerHistory[];
}

/** === AÑADIDO: tipo de idioma usado por LanguageSelector === */
export type Language = 'es' | 'pl';

