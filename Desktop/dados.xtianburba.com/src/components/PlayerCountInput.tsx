import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { playSound } from '../utils/audioUtils';

interface PlayerCountInputProps {
  onSubmit: (count: number) => void;
}

export const PlayerCountInput: React.FC<PlayerCountInputProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [playerCount, setPlayerCount] = useState<number>(2);

  const handleSubmit = () => {
    playSound('scoreSelect');
    onSubmit(playerCount);
  };

  const playerOptions = [2, 3, 4, 5, 6];

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('gameTitle')}</Text>
        <View style={styles.titleUnderline} />
      </View>
      
      <Text style={styles.subtitle}>{t('playerCount')}</Text>
      
      <View style={styles.selectionContainer}>
        {playerOptions.map((count) => (
          <TouchableOpacity
            key={count}
            style={[
              styles.playerCountButton,
              playerCount === count && styles.selectedPlayerCount,
            ]}
            onPress={() => {
              playSound('buttonPress');
              setPlayerCount(count);
            }}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.playerCountText,
              playerCount === count && styles.selectedPlayerCountText,
            ]}>
              {count}
            </Text>
            <Text style={[
              styles.playersLabel,
              playerCount === count && styles.selectedPlayersLabel,
            ]}>
              {t('players')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={handleSubmit}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>{t('continue')}</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          👥 {t('playerCountInfo')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#cbf857', // Color principal del tema
    textShadowColor: 'rgba(203, 248, 87, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: '#cbf857',
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 40,
    textAlign: 'center',
    color: '#E0E0E0',
    fontWeight: '500',
  },
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 50,
  },
  playerCountButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  selectedPlayerCount: {
    backgroundColor: '#2A2A2A',
    borderColor: '#cbf857',
    borderWidth: 3,
    shadowColor: '#cbf857',
    shadowOpacity: 0.4,
  },
  playerCountText: {
    color: '#E0E0E0',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedPlayerCountText: {
    color: '#cbf857',
  },
  playersLabel: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedPlayersLabel: {
    color: '#cbf857',
  },
  continueButton: {
    backgroundColor: '#cbf857',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#cbf857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});