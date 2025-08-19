// src/screens/ManualScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// IMPORTA los dos contenidos que te pasé antes
import ManualContentES from './ManualContentES';
import ManualContentPL from './ManualContentPL';

interface ManualScreenProps {
  onClose?: () => void;
}

const ManualScreen: React.FC<ManualScreenProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'es').toLowerCase();

  // Normalizamos para mapear bien subcódigos (es-ES, pl-PL, etc.)
  const isES = lang.startsWith('es');
  const isPL = lang.startsWith('pl');

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        {onClose ? (
          <TouchableOpacity onPress={onClose} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#cbf857" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>{t('guide') || 'Guía del juego'}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Contenido scrollable */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isPL ? <ManualContentPL onClose={onClose} /> : <ManualContentES onClose={onClose} />}
      </ScrollView>
    </View>
  );
};

export default ManualScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbf857',
    backgroundColor: '#1E1E1E',
  },
  backButton: { width: 34, alignItems: 'center' },
  headerTitle: { color: '#cbf857', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
});
