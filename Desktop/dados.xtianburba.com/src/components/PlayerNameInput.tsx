import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { playSound } from '../utils/audioUtils';
import { Player } from '../types';

/**
 * Componente para introducir los nombres de los jugadores. Valida
 * duplicados, campos vacíos y longitud mínima; muestra animaciones de error.
 */
interface PlayerNameInputProps {
  playerCount: number;
  onSubmit: (players: Player[]) => void;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ playerCount, onSubmit }) => {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: playerCount }, (_, idx) => ({ id: idx + 1, name: '' })),
  );
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [errorAnim] = useState(new Animated.Value(0));

  const updatePlayerName = (idx: number, name: string) => {
    const updated = [...players];
    updated[idx].name = name;
    setPlayers(updated);
    if (error && name.trim()) setError('');
  };

  const showError = (message: string) => {
    setError(message);
    playSound('buttonPress');
    Animated.sequence([
      Animated.timing(errorAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(errorAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    if (players.some(p => p.name.trim() === '')) {
      showError(t('playerNamesError'));
      return;
    }
    const lower = players.map(p => p.name.trim().toLowerCase());
    if (new Set(lower).size !== players.length) {
      showError(t('playerNamesDuplicateError'));
      return;
    }
    if (players.some(p => p.name.trim().length < 2)) {
      showError(t('playerNamesMinLengthError', { min: 2 }));
      return;
    }
    playSound('roundComplete');
    onSubmit(players.map(p => ({ ...p, name: p.name.trim() })));
  };

  const getPlayerIcon = (idx: number) => {
    const icons = ['🎯','🎲','🏆','⭐','🎪','🎨','🎻','🎮'];
    return icons[idx % icons.length];
  };

  const completedCount = players.filter(p => p.name.trim().length > 0).length;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('playerNames')}</Text>
        <View style={styles.titleUnderline} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        {players.map((p, idx) => (
          <View key={p.id} style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text style={styles.playerIcon}>{getPlayerIcon(idx)}</Text>
              <Text style={styles.label}>{t('playerLabel')} {idx + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, focusedInput === idx && styles.inputFocused]}
              value={p.name}
              onChangeText={text => updatePlayerName(idx, text)}
              placeholder={`${t('playerNamePlaceholder')} ${idx + 1}`}
              placeholderTextColor="#666"
              onFocus={() => setFocusedInput(idx)}
              onBlur={() => setFocusedInput(null)}
              maxLength={15}
              autoCapitalize="words"
              returnKeyType={idx === players.length - 1 ? 'done' : 'next'}
            />
          </View>
        ))}
        <View style={styles.scrollViewBottomPadding} />
      </ScrollView>
      {error ? (
        <Animated.Text
          style={[styles.error, {
            opacity: errorAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }),
          }]}
        >
          {`⚠️ ${error}`}
        </Animated.Text>
      ) : null}
      <View style={styles.progressContainer}>
        <TouchableOpacity
          disabled={completedCount !== players.length}
          style={[
            styles.startButton,
            completedCount === players.length && styles.startButtonEnabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.9}
        >
          <Text style={[
            styles.startButtonText,
            completedCount === players.length && styles.startButtonTextEnabled,
          ]}>
            🚀 {t('startGame')}
          </Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(completedCount / players.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedCount} / {players.length} {t('players')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titleContainer: { alignItems: 'center', marginBottom: 30 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#cbf857',
    textShadowColor: 'rgba(203,248,87,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleUnderline: { width: 80, height: 4, backgroundColor: '#cbf857', borderRadius: 2 },
  scrollView: { flex: 1, marginBottom: 20 },
  scrollContent: { paddingBottom: 20 },
  scrollViewBottomPadding: { height: 60 },
  inputContainer: { marginBottom: 25 },
  inputHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  playerIcon: { fontSize: 20, marginRight: 10 },
  label: { fontSize: 16, color: '#E0E0E0', fontWeight: '600' },
  input: {
    height: 55,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#1E1E1E',
    color: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFocused: { borderColor: '#cbf857' },
  error: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
    borderRadius: 8,
  },
  progressContainer: { alignItems: 'center' },
  startButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  startButtonEnabled: {
    backgroundColor: '#cbf857',
    shadowColor: '#cbf857',
    shadowOpacity: 0.3,
  },
  startButtonText: { fontSize: 18, fontWeight: 'bold', color: '#E0E0E0' },
  // Cambia el color del texto a negro cuando el botón está habilitado
  startButtonTextEnabled: { color: '#000' },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: { height: '100%', backgroundColor: '#cbf857', borderRadius: 4 },
  progressText: { color: '#B0B0B0', fontSize: 14, fontWeight: '500' },
});

export default PlayerNameInput;