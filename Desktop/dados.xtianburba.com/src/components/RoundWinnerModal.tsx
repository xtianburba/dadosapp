import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Player, PlayerScore } from '../types';
import { playSound } from '../utils/audioUtils';

interface RoundWinnerModalProps {
  visible: boolean;
  round: 'round1' | 'round2';
  players: Player[];
  scores: PlayerScore[];
  onContinue: () => void;
}

const RoundWinnerModal: React.FC<RoundWinnerModalProps> = ({
  visible,
  round,
  players,
  scores,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [scaleAnim] = React.useState(new Animated.Value(0.8));
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      playSound('roundWinner');
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  // Calcular puntuaciones de la ronda específica
  const roundScores = scores.map(playerScore => {
    let roundTotal = 0;
    Object.values(playerScore.scores[round]).forEach(entry => {
      if (entry.filled && !isNaN(Number(entry.value))) {
        roundTotal += Number(entry.value);
      }
    });
    return {
      playerId: playerScore.playerId,
      roundScore: roundTotal,
    };
  });

  // Encontrar al ganador de la ronda
  const sortedRoundScores = [...roundScores].sort((a, b) => b.roundScore - a.roundScore);
  const winner = players.find(p => p.id === sortedRoundScores[0].playerId);
  const winnerScore = sortedRoundScores[0].roundScore;

  const roundTitle = round === 'round1' ? t('round1Winner') : t('round2Winner');
  const buttonText = round === 'round1' ? t('nextRound') : t('viewFinalResults');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {}}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.title}>{roundTitle}</Text>
          
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerName}>{winner?.name}</Text>
            <Text style={styles.winnerScore}>
              {winnerScore} {t('points')}
            </Text>
          </View>

          <View style={styles.rankingContainer}>
            <Text style={styles.rankingTitle}>
              {round === 'round1' ? t('round1Results') : t('round2Results')}:
            </Text>
            {sortedRoundScores.map((score, index) => {
              const player = players.find(p => p.id === score.playerId);
              return (
                <View key={score.playerId} style={styles.rankingRow}>
                  <Text style={styles.position}>{index + 1}.</Text>
                  <Text style={styles.playerName}>{player?.name}</Text>
                  <Text style={styles.playerScore}>{score.roundScore} {t('pointsShort')}</Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cbf857',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cbf857',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'rgba(203, 248, 87, 0.1)',
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(203, 248, 87, 0.3)',
  },
  winnerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#cbf857',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  winnerScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  rankingContainer: {
    width: '100%',
    marginBottom: 25,
  },
  rankingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 10,
    textAlign: 'center',
  },
  rankingRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  position: {
    width: 25,
    fontWeight: 'bold',
    color: '#cbf857',
  },
  playerName: {
    flex: 1,
    color: '#E0E0E0',
  },
  playerScore: {
    width: 60,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#cbf857',
    borderRadius: 8,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoundWinnerModal;