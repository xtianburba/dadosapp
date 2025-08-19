import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ManualScreen from './ManualScreen';
import HistoryScreen from './HistoryScreen';
import { Player, GameState } from '../types';
import { hasSavedGameState, loadGameState } from '../utils/storageUtils';

interface SetupScreenProps {
  onSetupComplete: (players: Player[], state?: GameState) => void;
}

const MAX_NAME_LENGTH = 12;

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete }) => {
  const { t } = useTranslation();

  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
  ]);

  const [showManual, setShowManual] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string>('');

  // NUEVO: reanudar
  const [canResume, setCanResume] = useState(false);
  const [savedState, setSavedState] = useState<GameState | null>(null);

  useEffect(() => {
    const checkSaved = async () => {
      const exists = await hasSavedGameState();
      if (!exists) {
        setCanResume(false);
        setSavedState(null);
        return;
      }
      const state = await loadGameState();
      if (state && state.players?.length) {
        setCanResume(true);
        setSavedState(state);
      } else {
        setCanResume(false);
        setSavedState(null);
      }
    };
    checkSaved();
  }, []);

  const addPlayer = () => {
    const nextId = (players[players.length - 1]?.id ?? 0) + 1;
    setPlayers((prev) => [...prev, { id: nextId, name: '' }]);
  };

  const removePlayer = (id: number) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const validate = () => {
    if (players.length < 2) {
      setError(t('needAtLeastTwo') || 'Necesitas al menos 2 jugadores.');
      return false;
    }
    for (const p of players) {
      if (!p.name || !p.name.trim()) {
        setError(t('emptyNamesNotAllowed') || 'Ningún nombre puede estar vacío.');
        return false;
      }
      if (p.name.length > MAX_NAME_LENGTH) {
        setError(
          t('nameTooLong', { max: MAX_NAME_LENGTH }) ||
            `El nombre no puede tener más de ${MAX_NAME_LENGTH} caracteres.`
        );
        return false;
      }
    }
    setError('');
    return true;
  };

  const startGame = () => {
    if (!validate()) return;
    onSetupComplete(players);
  };

  const resumeGame = () => {
    if (!savedState) return;
    onSetupComplete(savedState.players, savedState);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t('gameTitle') ?? 'Kóści'}</Text>

        {/* NUEVO: Reanudar partida si existe estado guardado */}
        {canResume && (
          <TouchableOpacity style={styles.resumeButton} onPress={resumeGame}>
            <Text style={styles.resumeButtonText}>{t('resumeGame') ?? 'Reanudar partida'}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>{t('playerNames') ?? 'Jugadores'}</Text>

        {players.map((p, index) => (
          <View key={p.id} style={styles.playerRow}>
            <TextInput
              style={styles.input}
              value={p.name}
              onChangeText={(txt) => updatePlayerName(p.id, txt)}
              placeholder={t('playerNamePlaceholder') ?? 'Nombre del jugador'}
              placeholderTextColor="#888"
              maxLength={MAX_NAME_LENGTH}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.removeBtn, players.length <= 2 && styles.removeBtnDisabled]}
              onPress={() => players.length > 2 && removePlayer(p.id)}
              disabled={players.length <= 2}
            >
              <Text
                style={[
                  styles.removeBtnText,
                  players.length <= 2 && styles.removeBtnTextDisabled,
                ]}
              >
                −
              </Text>
            </TouchableOpacity>
            {index === players.length - 1 && (
              <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
                <Text style={styles.addBtnText}>＋</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
            <Text style={styles.primaryButtonText}>{t('newGame') ?? 'Nueva partida'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowHistory(true)}>
            <Text style={styles.secondaryButtonText}>{t('history') ?? 'Historial'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.manualButton} onPress={() => setShowManual(true)}>
            <Text style={styles.manualButtonText}>{t('guide') ?? 'Guía del juego'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showManual} animationType="slide" onRequestClose={() => setShowManual(false)}>
        <ManualScreen onClose={() => setShowManual(false)} />
      </Modal>

      <Modal
        visible={showHistory}
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <HistoryScreen onBack={() => setShowHistory(false)} />
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SetupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: {
    color: '#cbf857',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  /* NUEVO: botón Reanudar con tu estética */
  resumeButton: {
    backgroundColor: '#333',
    borderColor: '#cbf857',
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeButtonText: { color: '#cbf857', fontWeight: 'bold', fontSize: 16 },

  sectionTitle: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#2A2A2A',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#E0E0E0',
  },
  removeBtn: {
    width: 40,
    height: 40,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#444',
    borderWidth: 1,
  },
  removeBtnDisabled: { opacity: 0.4 },
  removeBtnText: { color: '#f44336', fontSize: 22, fontWeight: '900' },
  removeBtnTextDisabled: { color: '#a74a4a' },
  addBtn: {
    width: 40,
    height: 40,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#cbf857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#000', fontSize: 20, fontWeight: '900' },
  error: { color: '#f44336', textAlign: 'center', marginTop: 6, marginBottom: 10 },
  actions: { marginTop: 8, gap: 10 },
  primaryButton: {
    backgroundColor: '#cbf857',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#E0E0E0', fontWeight: '600', fontSize: 16 },
  manualButton: {
    borderColor: '#cbf857',
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  manualButtonText: { color: '#cbf857', fontWeight: 'bold', fontSize: 16 },
});
