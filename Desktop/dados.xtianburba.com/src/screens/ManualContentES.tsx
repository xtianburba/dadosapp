import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importar iconos de dados
import dice1 from '../../assets/icons/dice1.png';
import dice5 from '../../assets/icons/dice5.png';
import onePair from '../../assets/icons/onePair.png';
import twoPairs from '../../assets/icons/twoPairs.png';
import threeOfAKind from '../../assets/icons/threeOfAKind.png';
import fourOfAKind from '../../assets/icons/fourOfAKind.png';
import fiveOfAKind from '../../assets/icons/fiveOfAKind.png';
import full from '../../assets/icons/full.png';
import smallStraight from '../../assets/icons/smallStraight.png';
import bigStraight from '../../assets/icons/bigStraight.png';
import wildcard from '../../assets/icons/wildcard.png';

interface ManualContentProps {
  onClose?: () => void;
}

const ManualContentES: React.FC<ManualContentProps> = ({ onClose }) => {
  return (
    <>
      <Text style={styles.heading}>Objetivo del juego</Text>
      <Text style={styles.paragraph}>
        El objetivo es lograr la mayor cantidad de puntos formando combinaciones de dados que encajen en cada categoría de la hoja de puntuación. ¡Reúne a tus amigos y disfruten de este juego de dados!
      </Text>

      <Text style={styles.heading}>Cómo se juega</Text>
      <Text style={styles.paragraph}>
        Se juega con 5 dados entre 2 o más jugadores, turnándose. En tu turno puedes lanzar los dados hasta 3 veces. En el primer lanzamiento tiras todos los dados. Después de cada tiro, puedes apartar (conservar) algunos dados y volver a lanzar los demás para intentar mejorar tu jugada.
      </Text>
      <Text style={styles.paragraph}>
        Tras el último lanzamiento (o antes si decides plantarte con un buen resultado), debes elegir una categoría disponible y anotar en ella la puntuación obtenida según los dados. Si no logras ninguna combinación útil para las categorías que te quedan, debes anotar un 0 en alguna categoría libre. Luego pasa el turno al siguiente jugador.
      </Text>
      <Text style={styles.paragraph}>
        El juego termina cuando todos los jugadores han completado todas las categorías de la tabla de puntuación. Gana el jugador que tenga más puntos acumulados al final de la partida.
      </Text>

      <Text style={styles.heading}>Tirada de mano (bonificación)</Text>
      <Text style={styles.paragraph}>
        Si consigues una combinación válida en el primer tiro de tu turno y la anotas inmediatamente (sin relanzar), obtienes el doble de puntos por esa jugada. A esto se le llama una “tirada de mano”. 
        Por ejemplo, si sacas un 4x (cuatro dados iguales) en tu primer lanzamiento y lo apuntas en esa categoría, primero calcula su puntaje normal (sumando los dados correspondientes y cualquier puntaje fijo de la categoría) y luego duplica ese total.
      </Text>

      <Text style={styles.heading}>Categorías y puntuación</Text>
      <Text style={styles.paragraph}>
        Cada jugador debe completar una vez cada categoría en su hoja de puntuación. A continuación se describen las categorías disponibles y cómo se puntúan:
      </Text>
      {/* Categorías de números */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Unos — suma de los dados que muestran 1</Text>
        <Image source={dice1} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Cincos — suma de los dados que muestran 5</Text>
        <Image source={dice5} style={styles.categoryImage} />
      </View>
      <Text style={styles.paragraph}>
        *(Del mismo modo existen categorías para “Doses”, “Treses”, “Cuatros” y “Seises”, sumando únicamente los dados de esos valores.)*
      </Text>
      {/* Otras categorías de combinaciones */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Pareja — 2 dados iguales (suma de ambos)</Text>
        <Image source={onePair} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Doble pareja — 2 pares distintos (suma de los cuatro dados)</Text>
        <Image source={twoPairs} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Trío (3x) — 3 dados iguales (suma de los tres dados)</Text>
        <Image source={threeOfAKind} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Full (3 + 2) — tres de un número y dos de otro (20 puntos + suma de los cinco dados)</Text>
        <Image source={full} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Escalera pequeña (1-5) — 1-2-3-4-5 consecutivos (20 puntos)</Text>
        <Image source={smallStraight} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Escalera grande (2-6) — 2-3-4-5-6 consecutivos (30 puntos)</Text>
        <Image source={bigStraight} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Cuatro iguales (4x) — 4 dados iguales (25 puntos + suma de los cuatro dados)</Text>
        <Image source={fourOfAKind} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Poker (5x) — 5 dados iguales (30 puntos + suma de los cinco dados)</Text>
        <Image source={fiveOfAKind} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Oportunidad (comodín) — cualquier combinación (suma de todos los dados)</Text>
        <Image source={wildcard} style={styles.categoryImage} />
      </View>

      <Text style={styles.heading}>Uso de la aplicación</Text>
      <Text style={styles.paragraph}>
        • Puedes tocar en la tarjeta de un jugador para ver el detalle de sus puntos: cuánto lleva acumulado en cada categoría y cuántas categorías le quedan por llenar en la partida.
      </Text>
      <Text style={styles.paragraph}>
        • Si deseas quitar el sonido del juego, toca el ícono de engranaje (configuración) y desactiva el audio.
      </Text>

      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heading: { color: '#cbf857', fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 6 },
  paragraph: { color: '#E0E0E0', fontSize: 15.5, lineHeight: 22, marginBottom: 12 },
  categoryContainer: { marginTop: 14, alignItems: 'center' },
  categoryTitle: { color: '#E0E0E0', fontSize: 16, marginBottom: 6, textAlign: 'center' },
  categoryImage: { width: 58, height: 58, resizeMode: 'contain', tintColor: '#cbf857' },
  closeButton: {
    backgroundColor: '#cbf857', paddingVertical: 12, borderRadius: 10,
    alignItems: 'center', marginTop: 24, marginBottom: 20
  },
  closeButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});

export default ManualContentES;
