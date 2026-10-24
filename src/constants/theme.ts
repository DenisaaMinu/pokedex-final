/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0E0940',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    card: '#FFFFFF',
    badge: '#2E7D5B',
    badgeText: '#FFFFFF',
    // Colours from the Figma
    midnight: '#0E0940',
    purple: '#5631E8',
    spriteBackground: '#F6F6FF',
    detailHeader: '#EDF6FF',
    detailSilver: '#DBDAE6',
    detailTypeChip: 'rgba(14, 9, 64, 0.08)',
    detailMuted: 'rgba(14, 9, 64, 0.65)',
    detailStatTrack: '#DBDAE6',
    cardShadow: '0 2px 15px rgba(48, 55, 115, 0.15)',
    typeNormal: '#A8A77A',
    typeFire: '#EE8130',
    typeWater: '#6390F0',
    typeElectric: '#F7D02C',
    typeGrass: '#7AC74C',
    typeIce: '#96D9D6',
    typeFighting: '#C22E28',
    typePoison: '#A33EA1',
    typeGround: '#E2BF65',
    typeFlying: '#A98FF3',
    typePsychic: '#F95587',
    typeBug: '#A6B91A',
    typeRock: '#B6A136',
    typeGhost: '#735797',
    typeDragon: '#6F35FC',
    typeDark: '#705746',
    typeSteel: '#B7B7CE',
    typeFairy: '#D685AD',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    card: '#212225',
    badge: '#2E7D5B',
    badgeText: '#FFFFFF',
    // The Figma has no dark mode, so these are my own dark versions
    midnight: '#FFFFFF',
    purple: '#5631E8',
    spriteBackground: '#2E3135',
    detailHeader: '#172331',
    detailSilver: '#464653',
    detailTypeChip: 'rgba(255, 255, 255, 0.12)',
    detailMuted: 'rgba(255, 255, 255, 0.65)',
    detailStatTrack: '#464653',
    cardShadow: '0 2px 15px rgba(48, 55, 115, 0.15)',
    typeNormal: '#A8A77A',
    typeFire: '#EE8130',
    typeWater: '#6390F0',
    typeElectric: '#F7D02C',
    typeGrass: '#7AC74C',
    typeIce: '#96D9D6',
    typeFighting: '#C22E28',
    typePoison: '#A33EA1',
    typeGround: '#E2BF65',
    typeFlying: '#A98FF3',
    typePsychic: '#F95587',
    typeBug: '#A6B91A',
    typeRock: '#B6A136',
    typeGhost: '#735797',
    typeDragon: '#6F35FC',
    typeDark: '#705746',
    typeSteel: '#B7B7CE',
    typeFairy: '#D685AD',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const PokemonTypeColorKey = {
  normal: 'typeNormal',
  fire: 'typeFire',
  water: 'typeWater',
  electric: 'typeElectric',
  grass: 'typeGrass',
  ice: 'typeIce',
  fighting: 'typeFighting',
  poison: 'typePoison',
  ground: 'typeGround',
  flying: 'typeFlying',
  psychic: 'typePsychic',
  bug: 'typeBug',
  rock: 'typeRock',
  ghost: 'typeGhost',
  dragon: 'typeDragon',
  dark: 'typeDark',
  steel: 'typeSteel',
  fairy: 'typeFairy',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const RubikFonts = {
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  semiBold: 'Rubik-SemiBold',
  extraBold: 'Rubik-ExtraBold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  // The padding of the card's name strip in the Figma
  twoAndHalf: 12,
  threeAndHalf: 14,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  // In the Figma the artwork hangs 50px into the white part, and the tabs start 24px below it
  detailArtworkOverlap: 50,
  detailBodyTop: 74,
} as const;

export const Radius = {
  // The corners of the number badge in the Figma
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  pill: 99,
} as const;

export const Brand = {
  link: '#3c87f7',
  splash: '#208AEF',
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
