import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Player, ScoreRowKey } from '../types';
import { useTranslation } from 'react-i18next';

interface ScoreInputProps {
  currentPlayer: Player;
  rowKey: ScoreRowKey | string;   // compatibilidad
  rowLabel: string;

  // NUEVO: partes separadas para estilos distintos
  suggestionLabel?: string;       // ej: t('suggestion')  → verde bold + ":"
  suggestionDetail?: string;      // ej: redText          → rojo

  // (compatibilidad antigua si en algún sitio aún usas 'suggestion' plano)
  suggestion?: string;

  maxScore: number;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  currentPlayer,
  rowKey,
  rowLabel,
  suggestionLabel,
  suggestionDetail,
  suggestion,
  maxScore,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Al abrir SIEMPRE limpio
    setValue('');
    setError('');
    // foco
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [rowKey]);

  const validate = (text: string) => {
    if (text === '') {
      setError('');
      return false;
    }
    const n = Number(text);
    if (!Number.isFinite(n) || n < 0) {
      setError(t('invalidNumber') || 'Número inválido');
      return false;
    }
    if (n > maxScore) {
      setError(
        t('maxScoreExceeded', { max: maxScore }) ||
          `El máximo permitido es ${maxScore}.`
      );
      return false;
    }
    setError('');
    return true;
  };

  const onChange = (text: string) => {
    const clean = text.replace(/[^\d]/g, '');
    setValue(clean);
    validate(clean);
  };

  const submit = () => {
    if (!validate(value) || value === '') return;
    onSubmit(value);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {currentPlayer?.name} — {rowLabel}
      </Text>

      {/* Sugerencia compuesta: label (verde) + detalle (rojo) */}
      {(suggestionLabel || suggestionDetail) && (
        <Text style={styles.suggestionLine}>
          {!!suggestionLabel && (
            <Text style={styles.suggestionLabel}>
              {suggestionLabel}:{' '}
            </Text>
          )}
          {!!suggestionDetail && (
            <Text style={styles.suggestionDetail}>
              {suggestionDetail}
            </Text>
          )}
        </Text>
      )}

      {/* Fallback si solo llega 'suggestion' antigua */}
      {!suggestionLabel && !!suggestion && (
        <Text style={styles.suggestFallback}>{suggestion}</Text>
      )}

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={submit}
        placeholder={t('enterScore') || 'Introduce la puntuación'}
        placeholderTextColor="#888"
        style={styles.input}
        maxLength={4}
      />

      {/* Línea Max */}
      <Text style={styles.maxHint}>
        {t('maxScoreAllowed') || 'Max'}: <Text style={styles.maxValue}>{maxScore}</Text>
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnPrimary} onPress={submit} disabled={!!error || value === ''}>
          <Text style={styles.btnPrimaryText}>{t('confirm') || 'Aceptar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={onCancel}>
          <Text style={styles.btnSecondaryText}>{t('cancel') || 'Cancelar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScoreInput;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    padding: 16,
  },
  title: {
    color: '#cbf857',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Línea compuesta: "Sugerencia:" (verde bold) + "detalle" (rojo)
  suggestionLine: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  suggestionLabel: {
    color: '#cbf857',
    fontWeight: 'bold',
  },
  suggestionDetail: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  suggestFallback: {
    color: '#8AD45A',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 12,
    color: '#E0E0E0',
    fontSize: 18,
    textAlign: 'center',
  },
  maxHint: {
    marginTop: 6,
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: 12,
  },
  maxValue: { color: '#cbf857', fontWeight: '800' },

  error: {
    color: '#f44336',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#cbf857',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#000', fontWeight: '800' },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSecondaryText: { color: '#E0E0E0', fontWeight: '700' },
});
