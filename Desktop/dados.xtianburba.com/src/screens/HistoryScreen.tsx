import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { loadGameHistory } from '../utils/storageUtils';
import { GameHistoryEntry } from '../types';

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [winCounts, setWinCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadGameHistory().then(data => {
      setHistory(data);
      const counts: Record<string, number> = {};
      data.forEach(entry => {
        const sortedPlayers = entry.players
          .slice()
          .sort((a, b) => b.totalScore - a.totalScore);
        const topScore = sortedPlayers[0]?.totalScore ?? 0;
        sortedPlayers.forEach(p => {
          if (p.totalScore === topScore) {
            counts[p.name] = (counts[p.name] || 0) + 1;
          }
        });
      });
      setWinCounts(counts);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('history')}</Text>

      {Object.keys(winCounts).length > 0 && (
        <View style={styles.winsContainer}>
          <Text style={styles.winsTitle}>{t('wins')}</Text>
          <View style={styles.winBoxes}>
            {Object.entries(winCounts).map(([name, count]) => (
              <View key={name} style={styles.winBox}>
                <Text style={styles.winBoxText}>
                  {name}: {count}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {history.length === 0 ? (
          <Text style={styles.noHistory}>{t('noHistory')}</Text>
        ) : (
          history
            .slice()
            .reverse()
            .map(entry => {
              const players = entry.players
                .slice()
                .sort((a, b) => b.totalScore - a.totalScore);
              const topScore = players[0]?.totalScore ?? 0;
              return (
                <View key={entry.date} style={styles.entry}>
                  <Text style={styles.date}>
                    {new Date(entry.date).toLocaleString()}
                  </Text>
                  {players.map(p => (
                    <Text
                      key={p.name}
                      style={[
                        styles.player,
                        p.totalScore === topScore && styles.winner,
                      ]}
                    >
                      {p.name}: {p.totalScore}
                    </Text>
                  ))}
                </View>
              );
            })
        )}
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('back')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cbf857',
    textAlign: 'center',
    marginBottom: 20,
  },
  winsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  winsTitle: {
    color: '#cbf857',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  winBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  winBox: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  winBoxText: {
    color: '#cbf857',
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  entry: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  date: {
    color: '#cbf857',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  player: {
    color: '#E0E0E0',
  },
  winner: {
    color: '#cbf857',
  },
  noHistory: {
    color: '#E0E0E0',
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#cbf857',
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
