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
    // Segunda partida (orden fijo)
    round2: {
      [key: string]: ScoreEntry;
    };
  };
  totalScore: number;
}

export type GamePhase = 'setup' | 'round1' | 'round2' | 'finished';

export type Language = 'es' | 'pl';

export type ScoreRowKey = 
  | '1' | '2' | '3' | '4' | '5' | '6' 
  | 'onePair' | 'twoPairs' 
  | 'threeOfAKind' | 'fourOfAKind' | 'fiveOfAKind' 
  | 'full' | 'smallStraight' | 'bigStraight' | 'wildcard';


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