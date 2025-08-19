import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Player, PlayerScore, GamePhase, ScoreRowKey } from '../types';
import { useScoreRows } from '../utils/gameUtils';

/**
 * IMPORTA TUS ICONOS REALES (en /assets/icons).
 * Las claves del iconMap deben ser del tipo ScoreRowKey:
 * '1' | '2' | '3' | '4' | '5' | '6' | 'onePair' | 'twoPairs' | 'threeOfAKind' | 'fourOfAKind' | 'fiveOfAKind' | 'full' | 'smallStraight' | 'bigStraight' | 'wildcard'
 */
const iconMap: Record<ScoreRowKey, any> = {
  '1': require('../../assets/icons/dice1.png'),
  '2': require('../../assets/icons/dice2.png'),
  '3': require('../../assets/icons/dice3.png'),
  '4': require('../../assets/icons/dice4.png'),
  '5': require('../../assets/icons/dice5.png'),
  '6': require('../../assets/icons/dice6.png'),
  onePair: require('../../assets/icons/onePair.png'),
  twoPairs: require('../../assets/icons/twoPairs.png'),
  threeOfAKind: require('../../assets/icons/threeOfAKind.png'),
  fourOfAKind: require('../../assets/icons/fourOfAKind.png'),
  fiveOfAKind: require('../../assets/icons/fiveOfAKind.png'),
  full: require('../../assets/icons/full.png'),
  smallStraight: require('../../assets/icons/smallStraight.png'),
  bigStraight: require('../../assets/icons/bigStraight.png'),
  wildcard: require('../../assets/icons/wildcard.png'),
};

interface ScoreRowDef {
  key: ScoreRowKey;
  label: string;
  redText: string;
  hasIcon?: boolean;
}

interface ScoreTableProps {
  players: Player[];
  scores: PlayerScore[];
  currentPhase: GamePhase; // 'round1' | 'round2' | 'finished'
  currentPlayerIndex: number;
  currentRow?: ScoreRowKey | null; // fila actual en ronda 2 (si aplica)
  showAllPlayers: boolean; // ignorado visualmente en este layout (siempre jugador actual)
  rows?: ScoreRowDef[];
  onScoreSelect: (rowKey: ScoreRowKey) => void;
  onEditScore?: (playerId: number, rowKey: ScoreRowKey, round: 'round1' | 'round2') => void;
  onCategoryInfo?: (rowKey: ScoreRowKey) => void;
  onPlayerPress?: (index: number) => void; // no usado en este layout
}

const ScoreTable: React.FC<ScoreTableProps> = ({
  players,
  scores,
  currentPhase,
  currentPlayerIndex,
  currentRow,
  rows,
  onScoreSelect,
  onEditScore,
  onCategoryInfo,
}) => {
  const { t } = useTranslation();
  const tableRows: ScoreRowDef[] = rows ?? useScoreRows();

  // SIEMPRE mostramos solo al jugador actual en este layout 4 columnas
  const player = players[currentPlayerIndex];
  const pScore = scores[currentPlayerIndex];

  const isCellSelectable = (rowKey: ScoreRowKey) => {
    if (!pScore) return false;
    if (currentPhase === 'round1') {
      return !pScore.scores.round1[rowKey]?.filled;
    }
    if (currentPhase === 'round2') {
      return currentRow === rowKey && !pScore.scores.round2[rowKey]?.filled;
    }
    return false;
  };

  // Partir la lista de categorías en dos mitades
  const half = Math.ceil(tableRows.length / 2);
  const leftRows = tableRows.slice(0, half);
  const rightRows = tableRows.slice(half);

  const renderRow = (round: 'round1' | 'round2', row: ScoreRowDef) => {
    const rowKey = row.key;
    const entry = pScore?.scores[round][rowKey];
    const selectable =
      currentPhase === round && isCellSelectable(rowKey);
    const isZero = entry?.filled && Number(entry.value) === 0;
    const isCurrentCell =
      currentPhase === 'round2' &&
      currentRow === rowKey;

    return (
      <View key={`${round}-${rowKey}`} style={styles.row}>
        {/* ICONO categoría (abre modal informativo) */}
        <TouchableOpacity
          style={styles.iconCell}
          onPress={() => onCategoryInfo && onCategoryInfo(rowKey)}
          activeOpacity={0.8}
        >
          <Image source={iconMap[rowKey]} style={styles.categoryIcon} />
        </TouchableOpacity>

        {/* CELDA de puntos (jugador actual) */}
        <TouchableOpacity
          style={[
            styles.scoreCell,
            entry?.filled ? styles.filledCell : styles.emptyCell,
            selectable && styles.selectableCell,
            isCurrentCell && styles.currentCell,
            isZero && styles.zeroScoreCell,
          ]}
          onPress={() => selectable && onScoreSelect(rowKey)}
          onLongPress={() => entry?.filled && onEditScore && onEditScore(player.id, rowKey, round)}
          disabled={!selectable && !entry?.filled}
        >
          <Text
            style={[
              styles.cellText,
              isZero && styles.zeroScoreText,
            ]}
          >
            {entry?.filled ? entry.value : ''}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

const renderHalf = (halfRows: ScoreRowDef[], round: 'round1' | 'round2') => (
  <View style={styles.halfColumn}>
    {halfRows.map(r => renderRow(round, r))}
  </View>
);

  return (
  <View style={styles.wrapper}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.grid}>
        {(currentPhase === 'round1' || currentPhase === 'finished') &&
          renderHalf(leftRows, 'round1')}

        {(currentPhase === 'round2' || currentPhase === 'finished') &&
          renderHalf(leftRows, 'round2')}

        {(currentPhase === 'round1' || currentPhase === 'finished') &&
          renderHalf(rightRows, 'round1')}

        {(currentPhase === 'round2' || currentPhase === 'finished') &&
          renderHalf(rightRows, 'round2')}
      </View>
    </ScrollView>
  </View>
);
};

export default ScoreTable;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  grid: {
    // 2 columnas (cada una contiene pares de subfilas: icono + puntos)
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  halfColumn: {
    flex: 1, // ocupa 50% del ancho
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 8,
  },
  roundTitle: {
    color: '#cbf857',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: 1,
    borderTopColor: '#333',
    minHeight: 46,
  },
  iconCell: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  categoryIcon: { width: 28, height: 28 },
  scoreCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
  },
  emptyCell: { backgroundColor: '#2A2A2A' },
  filledCell: { backgroundColor: '#3D3D3D' },
  selectableCell: { backgroundColor: '#cbf857' },
  currentCell: { borderWidth: 2, borderColor: '#cbf857', backgroundColor: '#3D3D3D' },
  zeroScoreCell: { backgroundColor: '#4d2626', borderWidth: 1, borderColor: '#f44336' },
  cellText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E0E0E0',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  zeroScoreText: { color: '#f44336', fontWeight: 'bold' },
});
