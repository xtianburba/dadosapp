import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import ikon kostek
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

const ManualContentPL: React.FC<ManualContentProps> = ({ onClose }) => {
  return (
    <>
      <Text style={styles.heading}>Cel gry</Text>
      <Text style={styles.paragraph}>
        Celem gry jest zdobycie jak największej liczby punktów poprzez tworzenie określonych kombinacji na pięciu kościach. Rozgrywka jest najciekawsza w gronie przyjaciół!
      </Text>

      <Text style={styles.heading}>Jak grać</Text>
      <Text style={styles.paragraph}>
        Gra toczy się z udziałem 2 lub więcej osób, przy użyciu 5 sześciennych kostek. Gracze wykonują ruchy na zmianę (turami). W swojej turze gracz może wykonać do trzech rzutów. Pierwszy rzut zawsze odbywa się wszystkimi pięcioma kośćmi. Po każdym rzucie można zdecydować, które kości zatrzymać (zachować ich wynik), a które przerzucić ponownie, aby spróbować polepszyć układ.
      </Text>
      <Text style={styles.paragraph}>
        Po maksymalnie trzech rzutach gracz wybiera jedną z dostępnych kategorii na swojej tabeli punktów i zapisuje w niej wynik uzyskany z wyrzuconego układu kości. Jeżeli żaden uzyskany układ nie pasuje do pozostałych wolnych kategorii, należy wpisać 0 punktów w dowolną z nich (co oznacza jej skreślenie). Następnie kolejka przechodzi na następnego gracza.
      </Text>
      <Text style={styles.paragraph}>
        Gra kończy się, gdy wszyscy gracze wypełnią wszystkie kategorie na swoich arkuszach punktacji. Zwycięża gracz z najwyższą łączną liczbą punktów.
      </Text>

      <Text style={styles.heading}>Premia za pierwszy rzut</Text>
      <Text style={styles.paragraph}>
        Jeżeli gracz zdecyduje się zapisać wynik już po pierwszym rzucie w turze (bez przerzucania kości) i wyrzucony układ spełnia wymagania wybranej kategorii, otrzymuje za ten rzut podwójną liczbę punktów. Taki szczęśliwy rezultat z pierwszego podejścia nazywamy „rzutem z ręki”. 
        Przykład: jeśli w pierwszym rzucie uda Ci się wyrzucić karetę (cztery jednakowe kości) i od razu zapiszesz ją w kategorii Kareta, to najpierw obliczasz normalną wartość punktów za ten układ (zgodnie z zasadami punktacji opisanymi poniżej), a następnie podwajasz ten wynik.
      </Text>

      <Text style={styles.heading}>Kategorie i punktacja</Text>
      <Text style={styles.paragraph}>
        Każda kategoria może być wykorzystana tylko jeden raz w trakcie gry. Po zakończeniu swojej tury gracz musi wybrać jedną z wolnych kategorii i wpisać w nią wynik. Poniżej przedstawiono listę kategorii oraz sposób ich punktowania:
      </Text>
      {/* Kategorie liczbowe */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Jedynki — suma oczek na wszystkich kościach z numerem 1</Text>
        <Image source={dice1} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Piątki — suma oczek na wszystkich kościach z numerem 5</Text>
        <Image source={dice5} style={styles.categoryImage} />
      </View>
      <Text style={styles.paragraph}>
        *(Analogicznie punktuje się kategorie „Dwójek”, „Trójek”, „Czwórek” i „Szóstek” – sumując wszystkie kości z daną liczbą oczek.)*
      </Text>
      {/* Inne kategorie kombinacji */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Para — 2 kości o tej samej liczbie (suma ich oczek)</Text>
        <Image source={onePair} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Dwie pary — dwa różne zestawy po 2 takie same kości (suma oczek z czterech kości)</Text>
        <Image source={twoPairs} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Trójka (3x) — 3 kości z tą samą liczbą (suma oczek z trojki)</Text>
        <Image source={threeOfAKind} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Full (3 + 2) — trzy jednakowe + dwie jednakowe (20 pkt + suma oczek z wszystkich pięciu kości)</Text>
        <Image source={full} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Mały strit (1-5) — ciąg 1-2-3-4-5 (25 pkt)</Text>
        <Image source={smallStraight} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Duży strit (2-6) — ciąg 2-3-4-5-6 (30 pkt)</Text>
        <Image source={bigStraight} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Kareta (4x) — 4 kości z tą samą liczbą (25 pkt + suma oczek z karety)</Text>
        <Image source={fourOfAKind} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Poker (5x) — 5 jednakowych kości (30 pkt + suma oczek z wszystkich pięciu kości)</Text>
        <Image source={fiveOfAKind} style={styles.categoryImage} />
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Szansa (dowolny układ) — suma oczek ze wszystkich kości</Text>
        <Image source={wildcard} style={styles.categoryImage} />
      </View>

      <Text style={styles.heading}>Korzystanie z aplikacji</Text>
      <Text style={styles.paragraph}>
        • Kliknij kartę danego gracza, aby zobaczyć szczegółowe podsumowanie jego punktów: ile punktów zdobył w każdej kategorii oraz ile kategorii pozostało mu jeszcze do wypełnienia.
      </Text>
      <Text style={styles.paragraph}>
        • Ikona „zębatki” (ustawienia) pozwala wyciszyć dźwięki gry.
      </Text>

      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Zamknij</Text>
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

export default ManualContentPL;
