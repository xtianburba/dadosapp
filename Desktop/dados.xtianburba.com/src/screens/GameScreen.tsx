// src/screens/GameScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Alert,
  Platform,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  loadSounds, playSound, unloadSounds, setSoundMuted, getSoundMuted,
} from '../utils/audioUtils';
import ScoreTable from '../components/ScoreTable';
import ScoreInput from '../components/ScoreInput';
import GameResult from '../components/GameResult';
import RoundWinnerModal from '../components/RoundWinnerModal';
import { Player, PlayerScore, GamePhase, GameState, ScoreRowKey } from '../types';
import { initializePlayerScore, useScoreRows } from '../utils/gameUtils';
import { saveGameState, clearGameState, saveGameResult } from '../utils/storageUtils';
import gear from '../../assets/icons/gear.png';
import { Ionicons } from '@expo/vector-icons';
import ManualScreen from './ManualScreen';

interface GameScreenProps {
  players: Player[];
  onNewGame: () => void;
  initialState?: GameState | null;
}

const GameScreen: React.FC<GameScreenProps> = ({ players, onNewGame, initialState }) => {
  const { t } = useTranslation();

  const [currentPhase, setCurrentPhase] = useState<GamePhase>(initialState?.currentPhase ?? 'round1');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(initialState?.currentPlayerIndex ?? 0);
  const [currentRow, setCurrentRow] = useState<ScoreRowKey | undefined>(initialState?.currentRow as ScoreRowKey | undefined);

  const [showScoreInput, setShowScoreInput] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ScoreRowKey | null>(null);
  const [editingRound, setEditingRound] = useState<'round1' | 'round2' | null>(null);

  const [showRoundWinner, setShowRoundWinner] = useState<boolean>(false);
  const [roundWinnerType, setRoundWinnerType] = useState<'round1' | 'round2'>('round1');

  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  const [soundMuted, setSoundMutedState] = useState<boolean>(getSoundMuted());
  const [scores, setScores] = useState<PlayerScore[]>(
    initialState?.scores ?? players.map(p => initializePlayerScore(p.id)),
  );

  const rows = useScoreRows();

  // UI / modales
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [categoryInfoKey, setCategoryInfoKey] = useState<ScoreRowKey | null>(null);
  const [detailsPlayerIndex, setDetailsPlayerIndex] = useState<number | null>(null);

  useEffect(() => {
    loadSounds();
    return () => { unloadSounds(); };
  }, []);

  useEffect(() => {
    const state: GameState = { players, scores, currentPhase, currentPlayerIndex, currentRow };
    saveGameState(state);
  }, [players, scores, currentPhase, currentPlayerIndex, currentRow]);

  useEffect(() => {
    // guarda el estado inicial al montar
    const initial: GameState = { players, scores, currentPhase, currentPlayerIndex, currentRow };
    saveGameState(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRoundComplete = (round: 'round1' | 'round2') =>
    scores.every(ps => Object.values(ps.scores[round]).every(e => e.filled));

  const toggleSound = () => {
    const muted = !soundMuted;
    setSoundMuted(muted);
    setSoundMutedState(muted);
    if (!muted) playSound('success');
  };

  const handleExitGame = () => {
    playSound('buttonPress');
    const exit = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.8, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        clearGameState();
        onNewGame();
      });
    };
    const message = t('exitGameConfirm');
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) exit();
    } else {
      Alert.alert(t('exitGame'), message, [
        { text: t('cancel'), style: 'cancel' },
        { text: t('exitGameConfirmYes'), onPress: exit },
      ]);
    }
  };

  useEffect(() => {
    if (currentPhase === 'round1' && isRoundComplete('round1')) {
      setRoundWinnerType('round1');
      setShowRoundWinner(true);
    } else if (currentPhase === 'round2' && isRoundComplete('round2')) {
      setRoundWinnerType('round2');
      setShowRoundWinner(true);
    }
  }, [scores, currentPhase]);

  const handleRoundWinnerContinue = () => {
    setShowRoundWinner(false);
    if (roundWinnerType === 'round1') {
      playSound('roundComplete');
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      });
      setCurrentPhase('round2');
      setCurrentPlayerIndex(0);
      setCurrentRow('1');
    } else {
      playSound('gameComplete');
      const historyPlayers: { name: string; round1Score: number; round2Score: number; totalScore: number }[] = [];
      const updated = scores.map(ps => {
        let r1 = 0; let r2 = 0;
        Object.values(ps.scores.round1).forEach(e => { if (e.filled && !isNaN(Number(e.value))) r1 += Number(e.value); });
        Object.values(ps.scores.round2).forEach(e => { if (e.filled && !isNaN(Number(e.value))) r2 += Number(e.value); });
        historyPlayers.push({
          name: players.find(p => p.id === ps.playerId)?.name || '',
          round1Score: r1, round2Score: r2, totalScore: r1 + r2,
        });
        return { ...ps, totalScore: r1 + r2 };
      });
      setScores(updated);
      saveGameResult({ date: new Date().toISOString(), players: historyPlayers });
      setCurrentPhase('finished');
    }
  };

  const handleEditScore = (playerId: number, rowKey: ScoreRowKey, round: 'round1' | 'round2') => {
    const idx = players.findIndex(p => p.id === playerId);
    if (idx !== -1) setCurrentPlayerIndex(idx);
    setSelectedRow(rowKey);
    setEditingRound(round);
    setShowScoreInput(true);
  };

  const handleScoreSelect = (rowKey: ScoreRowKey) => {
    playSound('scoreSelect');
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setSelectedRow(rowKey);
    setEditingRound(null);
    setShowScoreInput(true);
  };

  const handleScoreSubmit = (value: string) => {
    if (!selectedRow) return;

    playSound('diceRoll');
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.7, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    const numericValue = parseInt(value, 10);
    const phaseToWrite: 'round1' | 'round2' =
      editingRound ?? (currentPhase === 'round1' ? 'round1' : 'round2');

    setScores(prev =>
      prev.map((ps, idx) => {
        if (idx !== currentPlayerIndex) return ps;
        const next = {
          ...ps,
          scores: {
            round1: { ...ps.scores.round1 },
            round2: { ...ps.scores.round2 },
          },
        };
        next.scores[phaseToWrite][selectedRow] = { value: numericValue, filled: true };
        return next;
      })
    );

    setShowScoreInput(false);
    setSelectedRow(null);
    setEditingRound(null);

    if (currentPhase === 'round1') {
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    } else {
      const updatedCurrentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      let nextRowKey = currentRow;

      if (updatedCurrentPlayerIndex === 0 && currentRow) {
        const idx = rows.findIndex(r => r.key === currentRow);
        if (idx < rows.length - 1) {
          nextRowKey = rows[idx + 1].key as ScoreRowKey;
          setCurrentRow(nextRowKey);
        }
      }

      setCurrentPlayerIndex(updatedCurrentPlayerIndex);

      const nextPs = scores[updatedCurrentPlayerIndex];
      if (nextRowKey && nextPs && !nextPs.scores.round2[nextRowKey].filled) {
        setTimeout(() => {
          setSelectedRow(nextRowKey!);
          setEditingRound('round2');
          setShowScoreInput(true);
        }, 200);
      }
    }
  };

  const getCurrentRowLabel = () => {
    if (selectedRow) {
      const row = rows.find(r => r.key === selectedRow);
      return row ? row.label : '';
    }
    return '';
  };

  // Rellenado rápido (test): rellena TODAS menos UNA
  const fillRandomly = () => {
    const phase: 'round1' | 'round2' = currentPhase === 'round1' ? 'round1' : 'round2';

    let slotToKeepEmpty: { playerIndex: number; key: ScoreRowKey } | null = null;

    if (phase === 'round2' && currentRow) {
      const cell = scores[currentPlayerIndex].scores.round2[currentRow];
      if (!cell.filled) {
        slotToKeepEmpty = { playerIndex: currentPlayerIndex, key: currentRow };
      }
    }

    if (!slotToKeepEmpty) {
      outer:
      for (let pIdx = 0; pIdx < scores.length; pIdx++) {
        const ps = scores[pIdx];
        for (const key of Object.keys(ps.scores[phase]) as ScoreRowKey[]) {
          if (!ps.scores[phase][key].filled) {
            slotToKeepEmpty = { playerIndex: pIdx, key };
            break outer;
          }
        }
      }
    }

    if (!slotToKeepEmpty) return;

    setScores(prev =>
      prev.map((ps, pIdx) => {
        const next = {
          ...ps,
          scores: {
            round1: { ...ps.scores.round1 },
            round2: { ...ps.scores.round2 },
          },
        };

        (Object.keys(next.scores[phase]) as ScoreRowKey[]).forEach((key) => {
          if (pIdx === slotToKeepEmpty!.playerIndex && key === slotToKeepEmpty!.key) return;
          const cell = next.scores[phase][key];
          if (!cell.filled) {
            const max = key === 'fiveOfAKind' ? 120 : 100;
            const val = Math.floor(Math.random() * (max + 1));
            next.scores[phase][key] = { value: val, filled: true };
          }
        });

        return next;
      })
    );

    const { playerIndex, key } = slotToKeepEmpty;
    setCurrentPlayerIndex(playerIndex);
    if (phase === 'round2') setCurrentRow(key);
    setSelectedRow(key);
    setEditingRound(phase);
    setShowScoreInput(true);
  };

  const totalForIndex = (idx: number) => {
    const ps = scores[idx];
    let r1 = 0; let r2 = 0;
    Object.values(ps.scores.round1).forEach(e => { if (e.filled && !isNaN(Number(e.value))) r1 += Number(e.value); });
    Object.values(ps.scores.round2).forEach(e => { if (e.filled && !isNaN(Number(e.value))) r2 += Number(e.value); });
    return { r1, r2, total: r1 + r2 };
  };

  const selectedRowDefinition = rows.find(r => r.key === (selectedRow ?? ''));
  const suggestionText = selectedRowDefinition?.redText;
  const maxScoreValue = selectedRow === 'fiveOfAKind' ? 120 : 100;

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

  const shortRound = (phase: 'round1' | 'round2') =>
    phase === 'round1' ? (t('round1') || 'Ronda 1') : (t('round2') || 'Ronda 2');

  return (
    <View style={styles.container}>
      {/* Header con engranaje */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSettingsOpen(o => !o)}
          style={styles.headerBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={gear} style={styles.gearIcon} />
        </TouchableOpacity>

        {/* placeholder derecho para centrar si más adelante añades algo */}
        <View style={styles.headerBtn} />
      </View>

      {/* MENÚ engranaje */}
      <Modal visible={settingsOpen} transparent animationType="fade" onRequestClose={() => setSettingsOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.menuCard}>
            <TouchableOpacity onPress={() => { setSettingsOpen(false); setShowManual(true); }} style={styles.menuItem}>
              <Text style={styles.menuText}>{t('guide') || 'Guía del juego'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { toggleSound(); setSettingsOpen(false); }} style={styles.menuItem}>
              <Text style={styles.menuText}>{soundMuted ? t('unmute') : t('mute')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { fillRandomly(); setSettingsOpen(false); }} style={styles.menuItem}>
              <Text style={styles.menuText}>{t('fillRandomly') || 'Rellenar (Prueba)'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSettingsOpen(false); handleExitGame(); }} style={styles.menuItem}>
              <Text style={[styles.menuText, { color: '#ff7070' }]}>{t('exitGame')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuClose} onPress={() => setSettingsOpen(false)}>
              <Ionicons name="close" size={22} color="#cbf857" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Guía */}
      <Modal visible={showManual} animationType="slide" onRequestClose={() => setShowManual(false)}>
        <ManualScreen onClose={() => setShowManual(false)} />
      </Modal>

      {/* Marca visual del juego */}
      <View style={styles.titleContainer}>
        <Image
          source={require('../../assets/icons/icon-2048.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('gameTitle')}</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* Título de ronda */}
      <Text style={styles.roundHeader}>
        {currentPhase === 'round1'
          ? `${t('round1')}`
          : currentPhase === 'round2'
          ? `${t('round2')}`
          : (t('gameFinished') || 'Finalizado')}
      </Text>

      {/* Barra de jugadores */}
      <View style={styles.playersBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersBarContent}>
          {players.map((p, idx) => {
            const isCurrent = idx === currentPlayerIndex;
            const name = p.name.length > 12 ? `${p.name.slice(0, 11)}…` : p.name;
            const { total } = totalForIndex(idx);
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.playerChip, isCurrent && styles.playerChipCurrent]}
                onPress={() => setDetailsPlayerIndex(idx)}
              >
                <Text style={styles.playerChipName}>{name || t('player') + ' ' + (idx + 1)}</Text>
                <Text style={styles.playerChipTotal}>{total}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Resultado final o tabla */}
      {currentPhase === 'finished' ? (
        <GameResult
          players={players}
          scores={scores}
          onNewGame={() => { clearGameState(); onNewGame(); }}
        />
      ) : (
        <>
          <Animated.View
            style={[
              styles.scoreTableWrapper,
              { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
            ]}
          >
            <ScoreTable
              players={players}
              scores={scores}
              currentPhase={currentPhase}
              currentPlayerIndex={currentPlayerIndex}
              currentRow={currentRow ?? null}
              onScoreSelect={handleScoreSelect}
              onEditScore={handleEditScore}
              showAllPlayers={false}
              rows={rows}
              onCategoryInfo={(k) => setCategoryInfoKey(k)}
            />
          </Animated.View>

          {/* Info de categoría */}
          <Modal visible={!!categoryInfoKey} transparent animationType="fade" onRequestClose={() => setCategoryInfoKey(null)}>
            <View style={styles.modalOverlay}>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>
                  {rows.find(r => r.key === categoryInfoKey)?.label}
                </Text>
                <Text style={styles.infoText}>
                  {rows.find(r => r.key === categoryInfoKey)?.redText?.replace('::', '\n')}
                </Text>
                <TouchableOpacity style={styles.infoClose} onPress={() => setCategoryInfoKey(null)}>
                  <Ionicons name="close" size={24} color="#cbf857" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* === Input de puntuación — SIEMPRE sobre el teclado === */}
          <Modal
            visible={showScoreInput}
            transparent
            animationType="fade"
            onRequestClose={() => setShowScoreInput(false)}
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.select({ ios: 'padding', android: 'height', default: undefined })}
              keyboardVerticalOffset={Platform.select({ ios: 24, android: 0, default: 0 })}
            >
              <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowScoreInput(false); }}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback onPress={() => { /* evita cerrar cuando tocas el card */ }}>
                    <View style={[styles.inputCard, styles.inputCardElevated]}>
                      <ScoreInput
                        currentPlayer={players[currentPlayerIndex]}
                        rowKey={(selectedRow || '') as any}
                        rowLabel={getCurrentRowLabel()}
                        suggestionLabel={t('suggestion')}
                        suggestionDetail={suggestionText || ''}
                        maxScore={maxScoreValue}
                        onSubmit={handleScoreSubmit}
                        onCancel={() => { setShowScoreInput(false); setSelectedRow(null); setEditingRound(null); }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>
        </>
      )}

      {/* Ganador de ronda */}
      <RoundWinnerModal
        visible={showRoundWinner}
        round={roundWinnerType}
        players={players}
        scores={scores}
        onContinue={handleRoundWinnerContinue}
      />

      {/* Detalles de jugador */}
      {detailsPlayerIndex !== null && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setDetailsPlayerIndex(null)}>
          <TouchableWithoutFeedback onPress={() => setDetailsPlayerIndex(null)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsTitle}>{players[detailsPlayerIndex]?.name}</Text>

                  {(() => {
                    const { r1, r2, total } = totalForIndex(detailsPlayerIndex);
                    return (
                      <Text style={styles.detailsHeaderLine}>
                        R1: <Text style={styles.detailsHeaderStrong}>{r1}</Text>   ·   R2:{' '}
                        <Text style={styles.detailsHeaderStrong}>{r2}</Text>   ·   {t('totalScore')}:{' '}
                        <Text style={styles.detailsHeaderStrong}>{total}</Text>
                      </Text>
                    );
                  })()}

                  <Text style={styles.detailsSubtitle}>
                    {t('pending')}{' '}(
                    {currentPhase === 'round1' ? (t('round1') || 'Ronda 1') : (t('round2') || 'Ronda 2')}
                    ):
                  </Text>

                  {(() => {
                    const roundKey: 'round1' | 'round2' = currentPhase === 'round1' ? 'round1' : 'round2';
                    const pendKeys = Object.keys(scores[detailsPlayerIndex].scores[roundKey]).filter(
                      k => !scores[detailsPlayerIndex].scores[roundKey][k as ScoreRowKey].filled
                    ) as ScoreRowKey[];

                    if (pendKeys.length === 0) {
                      return <Text style={styles.detailsText}>{t('allCompleted') || 'Todas las categorías completadas.'}</Text>;
                    }

                    return (
                      <View style={styles.pendingList}>
                        {pendKeys.map(k => {
                          const label = rows.find(r => r.key === k)?.label || k;
                          return (
                            <View key={k} style={styles.pendingRow}>
                              <Image source={iconMap[k]} style={styles.pendingIcon} />
                              <Text style={styles.pendingText}>{label}</Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })()}

                  <TouchableOpacity onPress={() => setDetailsPlayerIndex(null)} style={{ alignSelf: 'center', padding: 8 }}>
                    <Ionicons name="close" size={24} color="#cbf857" />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 10, paddingTop: 8,
  },
  headerLeft: { padding: 6 },
  headerRight: { padding: 6 },

  // === Barra de jugadores (centrada y con más aire) ===
  playersBar: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  playersBarContent: {
    paddingVertical: 6,
    justifyContent: 'center',
  },
  playerChip: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    marginVertical: 6,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerChipCurrent: {
    borderColor: '#cbf857',
    borderWidth: 2,
    backgroundColor: '#262626',
  },
  playerChipName: { color: '#E0E0E0', fontWeight: '700', fontSize: 12, textAlign: 'center' },
  playerChipTotal: { color: '#cbf857', fontWeight: '800', fontSize: 16, marginTop: 4 },

  scoreTableWrapper: { flex: 1 },

  // Modales genéricos
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuCard: {
    width: '88%', maxWidth: 360, backgroundColor: '#1E1E1E', borderRadius: 10,
    borderWidth: 1, borderColor: '#333', paddingVertical: 6,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 14 },
  menuText: { color: '#E0E0E0', fontSize: 16 },
  menuClose: { position: 'absolute', top: 8, right: 8 },

  infoCard: {
    width: '90%', maxWidth: 420, backgroundColor: '#1E1E1E',
    borderRadius: 12, borderWidth: 1, borderColor: '#333', padding: 16,
  },
  infoTitle: { color: '#cbf857', fontWeight: '700', fontSize: 16, textAlign: 'center', marginBottom: 8 },
  infoText: { color: '#E0E0E0', fontSize: 14, textAlign: 'center' },
  infoClose: { position: 'absolute', top: 8, right: 8, padding: 4 },

  // === Card del input (se eleva un pelín para que no lo tape el teclado) ===
  inputCard: { width: '90%', maxWidth: 420 },
  inputCardElevated: {
    marginBottom: 16, // separa del borde inferior cuando el teclado sube
  },

  detailsCard: {
    width: '90%', maxWidth: 420, backgroundColor: '#262626', borderRadius: 10,
    borderWidth: 1, borderColor: '#333', padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearIcon: { width: 26, height: 26, tintColor: '#cbf857' },

  roundHeader: {
    textAlign: 'center',
    color: '#cbf857',
    fontSize: 18,
    fontWeight: '800',
  },

  pendingList: {
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  pendingIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  pendingText: {
    color: '#E0E0E0',
    fontSize: 14,
  },

  titleContainer: { alignItems: 'center', marginBottom: 40 },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#cbf857',
    textShadowColor: 'rgba(203, 248, 87, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  titleUnderline: { width: 180, height: 3, backgroundColor: '#cbf857', borderRadius: 2 },

  detailsTitle: { color: '#cbf857', fontSize: 16, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  detailsHeaderLine: { color: '#E0E0E0', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  detailsHeaderStrong: { color: '#cbf857', fontWeight: '800' },
  detailsSubtitle: { color: '#E0E0E0', fontSize: 14, textAlign: 'center', marginBottom: 6 },
  detailsText: { color: '#E0E0E0', fontSize: 14, marginBottom: 8, textAlign: 'center' },
});
