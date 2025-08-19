import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Player, GamePhase } from '../types';

interface GameControlsProps {
  currentPlayer: Player;
  currentPhase: GamePhase;
  viewMode: 'all' | 'current' | 'none';
  onToggleView: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  currentPhase,
  viewMode,
  onToggleView,
}) => {
  const { t } = useTranslation();

  const getToggleLabel = () => {
    switch (viewMode) {
      case 'all':
        return t('showCurrent');
      case 'current':
        return t('hideScores');
      default:
        return t('showAll');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        {currentPhase !== 'finished' && (
          <View style={styles.playerTurnContainer}>
            <View style={styles.playerIndicator} />
            <Text style={styles.turnText}>
              {t('currentPlayer', { name: currentPlayer.name })}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={onToggleView} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{getToggleLabel()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 20,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  turnText: {
    fontSize: 20,
    color: '#cbf857',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  toggleButton: {
    backgroundColor: '#cbf857',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  toggleButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  playerTurnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(203, 248, 87, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  playerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#cbf857',
    marginRight: 10,
    shadowColor: '#cbf857',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default GameControls;