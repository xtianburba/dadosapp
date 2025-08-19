import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: 120,
    gap: 2,
  },
  diceContainer: {
    marginVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});

// Componente base para los dados
export const DiceBase: React.FC<{size?: number, color?: string, children?: React.ReactNode}> = ({ 
  size = 24, 
  color = '#333333ff', 
  children 
}) => {
  return (
    <View style={styles.diceContainer}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x="1" y="1" width="22" height="22" rx="4" fill="white" stroke={color} strokeWidth="1.5" />
        <Rect x="1" y="1" width="22" height="22" rx="4" fill="white" opacity="0.8" />
        {children}
      </Svg>
    </View>
  );
};

// Componentes para cada valor de dado
export const DiceOne: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333333ff' 
}) => (
  <DiceBase size={width} color={fill}>
    <Circle cx="12" cy="12" r="2.8" fill={fill} />
  </DiceBase>
);

export const DiceTwo: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => (
  <DiceBase size={width} color={fill}>
    <Circle cx="7" cy="7" r="2.8" fill={fill} />
    <Circle cx="17" cy="17" r="2.8" fill={fill} />
  </DiceBase>
);

export const DiceThree: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => (
  <DiceBase size={width} color={fill}>
    <Circle cx="7" cy="7" r="2.8" fill={fill} />
    <Circle cx="12" cy="12" r="2.8" fill={fill} />
    <Circle cx="17" cy="17" r="2.8" fill={fill} />
  </DiceBase>
);

export const DiceFour: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => (
  <DiceBase size={width} color={fill}>
    <Circle cx="7" cy="7" r="2.8" fill={fill} />
    <Circle cx="17" cy="7" r="2.8" fill={fill} />
    <Circle cx="7" cy="17" r="2.8" fill={fill} />
    <Circle cx="17" cy="17" r="2.8" fill={fill} />
  </DiceBase>
);

export const DiceFive: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => (
  <DiceBase size={width} color={fill}>
    <Circle cx="7" cy="7" r="2.8" fill={fill} />
    <Circle cx="17" cy="7" r="2.8" fill={fill} />
    <Circle cx="12" cy="12" r="2.8" fill={fill} />
    <Circle cx="7" cy="17" r="2.8" fill={fill} />
    <Circle cx="17" cy="17" r="2.8" fill={fill} />
  </DiceBase>
);

export const DiceSix: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => (
  <DiceBase size={width} color={fill}>
    <Circle cx="7" cy="6" r="2.8" fill={fill} />
    <Circle cx="17" cy="6" r="2.8" fill={fill} />
    <Circle cx="7" cy="12" r="2.8" fill={fill} />
    <Circle cx="17" cy="12" r="2.8" fill={fill} />
    <Circle cx="7" cy="18" r="2.8" fill={fill} />
    <Circle cx="17" cy="18" r="2.8" fill={fill} />
  </DiceBase>
);

// Componente para mostrar un par
export const OnePair: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.7;
  return (
    <View style={styles.row}>
      <DiceFive width={diceSize} height={diceSize} fill={fill} />
      <DiceFive width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar dos pares
export const TwoPairs: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.5;
  return (
    <View style={styles.row}>
      <DiceFour width={diceSize} height={diceSize} fill={fill} />
      <DiceFour width={diceSize} height={diceSize} fill={fill} />
      <DiceTwo width={diceSize} height={diceSize} fill={fill} />
      <DiceTwo width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar tres dados iguales
export const ThreeOfAKind: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.6;
  return (
    <View style={styles.row}>
      <DiceThree width={diceSize} height={diceSize} fill={fill} />
      <DiceThree width={diceSize} height={diceSize} fill={fill} />
      <DiceThree width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar cuatro dados iguales
export const FourOfAKind: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.5;
  return (
    <View style={styles.row}>
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar cinco dados iguales
export const FiveOfAKind: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.45;
  return (
    <View style={styles.row}>
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar full house (tres de un tipo y dos de otro)
export const FullHouse: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.45;
  return (
    <View style={styles.row}>
      <DiceFive width={diceSize} height={diceSize} fill={fill} />
      <DiceFive width={diceSize} height={diceSize} fill={fill} />
      <DiceFive width={diceSize} height={diceSize} fill={fill} />
      <DiceTwo width={diceSize} height={diceSize} fill={fill} />
      <DiceTwo width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar escalera pequeña (1-2-3-4-5)
export const SmallStraight: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.5;
  return (
    <View style={styles.row}>
      <DiceOne width={diceSize} height={diceSize} fill={fill} />
      <DiceTwo width={diceSize} height={diceSize} fill={fill} />
      <DiceThree width={diceSize} height={diceSize} fill={fill} />
      <DiceFour width={diceSize} height={diceSize} fill={fill} />
      <DiceFive width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar escalera grande (2-3-4-5-6)
export const BigStraight: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  const diceSize = width * 0.5;
  return (
    <View style={styles.row}>
      <DiceTwo width={diceSize} height={diceSize} fill={fill} />
      <DiceThree width={diceSize} height={diceSize} fill={fill} />
      <DiceFour width={diceSize} height={diceSize} fill={fill} />
      <DiceFive width={diceSize} height={diceSize} fill={fill} />
      <DiceSix width={diceSize} height={diceSize} fill={fill} />
    </View>
  );
};

// Componente para mostrar comodín (cualquier combinación)
export const Wildcard: React.FC<{width?: number, height?: number, fill?: string}> = ({ 
  width = 24, 
  height = 24, 
  fill = '#333' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Rect x="1" y="1" width="22" height="22" rx="3" fill="white" stroke={fill} strokeWidth="1.5" />
      <Path d="M12 5.5C8.5 5.5 7 9 7 12C7 15 9 18.5 12 18.5C15 18.5 17 15 17 12C17 9 15.5 5.5 12 5.5ZM12 16.5C10.3 16.5 9 14.5 9 12C9 9.5 10.3 7.5 12 7.5C13.7 7.5 15 9.5 15 12C15 14.5 13.7 16.5 12 16.5Z" fill={fill} />
      <Path d="M12 9.5C11.2 9.5 10.5 10.2 10.5 11C10.5 11.8 11.2 12.5 12 12.5C12.8 12.5 13.5 11.8 13.5 11C13.5 10.2 12.8 9.5 12 9.5Z" fill={fill} />
      <Path d="M10 14L14 14" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
};