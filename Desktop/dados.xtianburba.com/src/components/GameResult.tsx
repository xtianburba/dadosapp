import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { playSound } from '../utils/audioUtils';
import { Player, PlayerScore } from '../types';

interface GameResultProps {
  players: Player[];
  scores: PlayerScore[];
  onNewGame: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ players, scores, onNewGame }) => {
  const { t } = useTranslation();
  
  // Animaciones
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(50));
  
  React.useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Calcular puntuaciones por ronda
  const calculateRoundScores = (round: 'round1' | 'round2') => {
    return scores.map(playerScore => {
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
  };

  const round1Scores = calculateRoundScores('round1');
  const round2Scores = calculateRoundScores('round2');

  // Calcular puntuaciones totales
  const totalScores = scores.map(playerScore => {
    const round1Total = round1Scores.find(r => r.playerId === playerScore.playerId)?.roundScore || 0;
    const round2Total = round2Scores.find(r => r.playerId === playerScore.playerId)?.roundScore || 0;
    return {
      playerId: playerScore.playerId,
      round1Score: round1Total,
      round2Score: round2Total,
      totalScore: round1Total + round2Total,
    };
  });

  // Ordenar por puntuación total
  const sortedTotalScores = [...totalScores].sort((a, b) => b.totalScore - a.totalScore);
  const sortedRound1Scores = [...round1Scores].sort((a, b) => b.roundScore - a.roundScore);
  const sortedRound2Scores = [...round2Scores].sort((a, b) => b.roundScore - a.roundScore);
  
  // Encontrar ganadores
  const finalWinner = players.find(p => p.id === sortedTotalScores[0].playerId);
  const round1Winner = players.find(p => p.id === sortedRound1Scores[0].playerId);
  const round2Winner = players.find(p => p.id === sortedRound2Scores[0].playerId);

  // Obtener emojis para posiciones
  const getPositionEmoji = (position: number) => {
    const emojis = ['🏆', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
    return emojis[position - 1] || '🎯';
  };

  const handleNewGame = () => {
    playSound('buttonPress');
    
    // Animación de salida
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onNewGame();
    });
  };

  const renderRoundResults = (roundScores: any[], title: string, winner: Player | undefined, roundKey: string) => (
    <View style={styles.roundResultsContainer}>
      <Text style={styles.roundTitle}>{title}</Text>
      <View style={styles.winnerContainer}>
        <Text style={styles.roundWinnerText}>
          {getPositionEmoji(1)} {t('winner')}: {winner?.name}
        </Text>
        <Text style={styles.roundWinnerScore}>
          {roundScores[0]?.roundScore || 0} {t('pointsShort')}
        </Text>
      </View>
      <View style={styles.roundScoresList}>
        {roundScores.map((score, index) => {
          const player = players.find(p => p.id === score.playerId);
          const isWinner = index === 0;
          return (
            <View key={score.playerId} style={[styles.resultRow, isWinner && styles.winnerRow]}>
              <Text style={styles.positionEmoji}>{getPositionEmoji(index + 1)}</Text>
              <Text style={[styles.playerName, isWinner && styles.winnerText]}>{player?.name}</Text>
              <Text style={[styles.playerScore, isWinner && styles.winnerText]}>
                {score.roundScore} {t('pointsShort')}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>🎉 {t('gameFinished')}</Text>
          <View style={styles.titleUnderline} />
        </View>
        
        {/* Ganador Final */}
        <View style={styles.finalWinnerContainer}>
          <View style={styles.crownContainer}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
          <Text style={styles.finalWinnerLabel}>{t('winner')} Final:</Text>
          <Text style={styles.winnerName}>{finalWinner?.name}</Text>
          <Text style={styles.winnerScore}>
            {sortedTotalScores[0].totalScore} {t('points')}
          </Text>
        </View>

        {/* Resultados Primera Ronda */}
        {renderRoundResults(sortedRound1Scores, t('round1Results'), round1Winner, 'round1')}

        {/* Resultados Segunda Ronda */}
        {renderRoundResults(sortedRound2Scores, t('round2Results'), round2Winner, 'round2')}

        {/* Clasificación Final Detallada */}
        <View style={styles.finalResultsContainer}>
          <Text style={styles.resultsTitle}>📊 {t('finalRanking')}</Text>
          
          {/* Encabezado de tabla */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}></Text>
            <Text style={styles.headerText}>{t('player')}</Text>
            <Text style={styles.headerText}>R1</Text>
            <Text style={styles.headerText}>R2</Text>
            <Text style={styles.headerText}>Total</Text>
          </View>
          
          {/* Filas de resultados */}
          {sortedTotalScores.map((score, index) => {
            const player = players.find(p => p.id === score.playerId);
            const isWinner = index === 0;
            return (
              <View key={score.playerId} style={[styles.finalResultRow, isWinner && styles.winnerRow]}>
                <Text style={styles.positionEmoji}>{getPositionEmoji(index + 1)}</Text>
                <Text style={[styles.playerNameFinal, isWinner && styles.winnerText]}>{player?.name}</Text>
                <Text style={[styles.roundScore, isWinner && styles.winnerText]}>{score.round1Score}</Text>
                <Text style={[styles.roundScore, isWinner && styles.winnerText]}>{score.round2Score}</Text>
                <Text style={[styles.totalScore, isWinner && styles.totalWinnerScore]}>{score.totalScore}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <Text style={styles.newGameButtonText}>🎮 {t('newGame')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#cbf857',
    textAlign: 'center',
    textShadowColor: 'rgba(203, 248, 87, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 10,
  },
  titleUnderline: {
    width: 120,
    height: 4,
    backgroundColor: '#cbf857',
    borderRadius: 2,
  },
  finalWinnerContainer: {
    alignItems: 'center',
    marginBottom: 35,
    padding: 25,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#cbf857',
    shadowColor: '#cbf857',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  crownContainer: {
    marginBottom: 15,
  },
  crownEmoji: {
    fontSize: 48,
  },
  finalWinnerLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#E0E0E0',
    fontWeight: '600',
  },
  winnerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#cbf857',
    marginBottom: 8,
    textShadowColor: 'rgba(203, 248, 87, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  winnerScore: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  roundResultsContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cbf857',
    marginBottom: 15,
    textAlign: 'center',
  },
  winnerContainer: {
    backgroundColor: 'rgba(203, 248, 87, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(203, 248, 87, 0.3)',
  },
  roundWinnerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cbf857',
    marginBottom: 5,
  },
  roundWinnerScore: {
    fontSize: 14,
    color: '#E0E0E0',
    fontWeight: '600',
  },
  roundScoresList: {
    gap: 5,
  },
  finalResultsContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#cbf857',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#cbf857',
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#cbf857',
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  resultRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  finalResultRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  winnerRow: {
    backgroundColor: 'rgba(203, 248, 87, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(203, 248, 87, 0.3)',
  },
  positionEmoji: {
    fontSize: 20,
    marginRight: 10,
    minWidth: 30,
  },
  playerName: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '500',
  },
  playerNameFinal: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
  },
  playerScore: {
    width: 70,
    textAlign: 'right',
    fontWeight: '600',
    color: '#E0E0E0',
    fontSize: 16,
  },
  roundScore: {
    flex: 1,
    textAlign: 'center',
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '500',
  },
  totalScore: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#cbf857',
    fontSize: 18,
  },
  totalWinnerScore: {
    fontSize: 20,
    textShadowColor: 'rgba(203, 248, 87, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  winnerText: {
    color: '#cbf857',
    fontWeight: 'bold',
  },
  newGameButton: {
    backgroundColor: '#cbf857',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#cbf857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 10,
  },
  newGameButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameResult;