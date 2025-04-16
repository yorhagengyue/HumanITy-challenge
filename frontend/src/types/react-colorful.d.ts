declare module 'react-colorful' {
  import { ComponentType } from 'react';

  export interface ColorPickerProps {
    color: string;
    onChange: (newColor: string) => void;
  }

  export const HexColorPicker: ComponentType<ColorPickerProps>;
  export const RgbColorPicker: ComponentType<ColorPickerProps>;
  export const HslColorPicker: ComponentType<ColorPickerProps>;
  export const HsvColorPicker: ComponentType<ColorPickerProps>;
  export const RgbaColorPicker: ComponentType<ColorPickerProps>;
  export const HslaColorPicker: ComponentType<ColorPickerProps>;
  export const HsvaColorPicker: ComponentType<ColorPickerProps>;
} 