import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/i18n';
import SetupScreen from './src/screens/SetupScreen';
import GameScreen from './src/screens/GameScreen';
import { Language } from './index';
import LanguageSelector from './src/components/LanguageSelector';
import { Player, GameState } from './src/types';
import { clearGameState } from './src/utils/storageUtils';

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [initialState, setInitialState] = useState<GameState | null>(null);

  const handleSetupComplete = (setupPlayers: Player[], state?: GameState) => {
    setPlayers(setupPlayers);
    setInitialState(state ?? null);
  };

  const handleNewGame = () => {
    clearGameState();
    setPlayers(null);
    setInitialState(null);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {language ? (
          players ? (
            <GameScreen
              players={players}
              onNewGame={handleNewGame}
              initialState={initialState}
            />
          ) : (
            <SetupScreen onSetupComplete={handleSetupComplete} />
          )
        ) : (
          <LanguageSelector onLanguageSelected={(language) => {
            i18n.changeLanguage(language);
            setLanguage(language);
          }} />
        )}
      </SafeAreaView>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' }
});
