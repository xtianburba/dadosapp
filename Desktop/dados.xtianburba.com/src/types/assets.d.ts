// src/types/assets.d.ts  (o images.d.ts en la raíz)
declare module '*.png' {
  const value: any; // o: import { ImageSourcePropType } from 'react-native'; const value: ImageSourcePropType;
  export default value;
}
declare module '*.jpg' {
  const value: any;
  export default value;
}
declare module '*.jpeg' {
  const value: any;
  export default value;
}
declare module '*.gif' {
  const value: any;
  export default value;
}
declare module '*.webp' {
  const value: any;
  export default value;
}
