import { PlayerScore, ScoreRowKey } from '../types';
import { useTranslation } from 'react-i18next';

// Calcular la puntuación total de un jugador
export const calculateTotalScore = (playerScore: PlayerScore): number => {
  const sumRound = (round: 'round1' | 'round2') =>
    Object.values(playerScore.scores[round]).reduce((sum, entry) => {
      const value = typeof entry.value === 'number' ? entry.value : 0;
      return sum + value;
    }, 0);

  return sumRound('round1') + sumRound('round2');
};

// Verificar si una ronda está completa
export const isRoundComplete = (
  scores: PlayerScore[],
  round: 'round1' | 'round2'
): boolean => {
  return scores.every(playerScore =>
    Object.values(playerScore.scores[round]).every(entry => entry.filled)
  );
};

// Inicializar las puntuaciones de un jugador
export const initializePlayerScore = (playerId: number): PlayerScore => {
  const emptyRound = (): Record<ScoreRowKey, { value: number | null; filled: boolean }> => ({
    '1': { value: null, filled: false },
    '2': { value: null, filled: false },
    '3': { value: null, filled: false },
    '4': { value: null, filled: false },
    '5': { value: null, filled: false },
    '6': { value: null, filled: false },
    onePair: { value: null, filled: false },
    twoPairs: { value: null, filled: false },
    threeOfAKind: { value: null, filled: false },
    fourOfAKind: { value: null, filled: false },
    fiveOfAKind: { value: null, filled: false },
    full: { value: null, filled: false },
    smallStraight: { value: null, filled: false },
    bigStraight: { value: null, filled: false },
    wildcard: { value: null, filled: false },
  });

  return {
    playerId,
    scores: {
      round1: emptyRound(),
      round2: emptyRound(),
    },
    totalScore: 0,
  };
};

// Definiciones de las filas de la tabla de puntuación con soporte para i18n
export const useScoreRows = () => {
  const { t } = useTranslation();

  // Orden actualizado según los requisitos con texto en rojo adicional
  return [
    { key: '1' as ScoreRowKey, label: t('diceValues.1'), redText: 'Σ', hasIcon: true },
    { key: '2' as ScoreRowKey, label: t('diceValues.2'), redText: 'Σ', hasIcon: true },
    { key: '3' as ScoreRowKey, label: t('diceValues.3'), redText: 'Σ', hasIcon: true },
    { key: '4' as ScoreRowKey, label: t('diceValues.4'), redText: 'Σ', hasIcon: true },
    { key: '5' as ScoreRowKey, label: t('diceValues.5'), redText: 'Σ', hasIcon: true },
    { key: '6' as ScoreRowKey, label: t('diceValues.6'), redText: 'Σ', hasIcon: true },
    { key: 'onePair' as ScoreRowKey, label: t('diceValues.onePair'), redText: 'Σ', hasIcon: true },
    { key: 'twoPairs' as ScoreRowKey, label: t('diceValues.twoPairs'), redText: 'Σ', hasIcon: true },
    { key: 'threeOfAKind' as ScoreRowKey, label: t('diceValues.threeOfAKind'), redText: 'Σ', hasIcon: true },
    { key: 'full' as ScoreRowKey, label: t('diceValues.full'), redText: '20+Σ', hasIcon: true },
    { key: 'smallStraight' as ScoreRowKey, label: t('diceValues.smallStraight'), redText: '20', hasIcon: true },
    { key: 'bigStraight' as ScoreRowKey, label: t('diceValues.bigStraight'), redText: '30', hasIcon: true },
    { key: 'fourOfAKind' as ScoreRowKey, label: t('diceValues.fourOfAKind'), redText: '25+Σ', hasIcon: true },
    { key: 'fiveOfAKind' as ScoreRowKey, label: t('diceValues.fiveOfAKind'), redText: '30+Σ', hasIcon: true },
    { key: 'wildcard' as ScoreRowKey, label: t('diceValues.wildcard'), redText: 'Σ', hasIcon: true },
  ];
};