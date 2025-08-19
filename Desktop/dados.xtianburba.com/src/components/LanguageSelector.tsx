import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { playSound } from '../utils/audioUtils';
import { Language } from '../types';

interface LanguageSelectorProps {
  onLanguageSelected: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelected }) => {
  const { t } = useTranslation();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: t('spanish'), flag: '🇪🇸' },
    { code: 'pl', label: t('polish'), flag: '🇵🇱' },
    // Si quieres volver a añadir inglés más tarde:
    // { code: 'en', label: t('english'), flag: '🇬🇧' },
  ];

  const handleLanguageSelect = (language: Language) => {
    playSound('buttonPress');
    onLanguageSelected(language);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {/* Icono propio en lugar del emoji 🎲 */}
        <Image
          source={require('../../assets/icons/icon-2048.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('gameTitle')}</Text>
        <View style={styles.titleUnderline} />
      </View>

      <Text style={styles.subtitle}>{t('selectLanguage')}</Text>

      <View style={styles.languageContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageButton}
            onPress={() => handleLanguageSelect(lang.code)}
            activeOpacity={0.8}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={styles.languageText}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          © 2025 XtianBurba • All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#121212' },
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
  subtitle: { color: '#E0E0E0', marginTop: 8, marginBottom: 20, fontSize: 16, textAlign: 'center' },
  languageContainer: { width: '100%', gap: 12, marginTop: 10 },
  languageButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  flag: { fontSize: 22 },
  languageText: { color: '#E0E0E0', fontSize: 18, fontWeight: '600' },
  infoContainer: {
    marginTop: 28,
    padding: 10,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: { color: '#B0B0B0', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
});

export default LanguageSelector;
