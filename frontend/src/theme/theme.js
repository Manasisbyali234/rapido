import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

// Scale helpers
export const sw = (px) => (px / 390) * W;   // scale by width  (base 390)
export const sh = (px) => (px / 844) * H;   // scale by height (base 844)
export const sf = (px) => Math.round(sw(px)); // scale font

// Safe top inset (fallback for screens not using SafeAreaView)
export const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44;

export const colors = {
  yellow: '#FFC400',
  yellowDark: '#E6B000',
  yellowLight: '#FFF8DC',
  black: '#111111',
  charcoal: '#2C2C2C',
  white: '#FFFFFF',
  bg: '#F4F5F7',
  card: '#FFFFFF',
  border: '#E8E8EC',
  borderFocus: '#FFC400',
  grey: '#7A7A80',
  greyLight: '#C4C4C8',
  greyBg: '#F0F0F3',
  success: '#16A34A',
  successBg: '#DCFCE7',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  info: '#2563EB',
  infoBg: '#DBEAFE',
  auto: '#FFC400',
  bike: '#059669',
  cab: '#1E293B',
  autoBg: '#FFF8DC',
  bikeBg: '#D1FAE5',
  cabBg: '#E2E8F0',
  overlay: 'rgba(0,0,0,0.45)',
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const radius = {
  xs: 6, sm: 10, md: 16, lg: 24, xl: 32, pill: 999,
};

export const type = {
  h1: { fontSize: sf(26), fontWeight: '800', color: colors.black, letterSpacing: -0.4 },
  h2: { fontSize: sf(21), fontWeight: '700', color: colors.black, letterSpacing: -0.3 },
  h3: { fontSize: sf(16), fontWeight: '700', color: colors.black },
  body: { fontSize: sf(14), fontWeight: '400', color: colors.charcoal, lineHeight: sf(20) },
  small: { fontSize: sf(12), fontWeight: '400', color: colors.grey, lineHeight: sf(17) },
  label: { fontSize: sf(11), fontWeight: '700', color: colors.grey, letterSpacing: 0.6, textTransform: 'uppercase' },
  caption: { fontSize: sf(11), fontWeight: '500', color: colors.greyLight },
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
};
