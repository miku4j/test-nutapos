/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import '../styles/layers.css'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          'primary': '#4CAF50',
          'primary-darken-1': '#388E3C',
          'primary-lighten-1': '#66BB6A',
          'secondary': '#8BC34A',
          'secondary-darken-1': '#689F38',
          'secondary-lighten-1': '#9CCC65',
          'accent': '#69F0AE',
          'error': '#FF5252',
          'info': '#2196F3',
          'success': '#4CAF50',
          'warning': '#FFC107',
          'surface': '#FFFFFF',
          'on-surface': '#1C1B1F',
          'background': '#F5F5F5',
          'on-background': '#1C1B1F',
        },
      },
      dark: {
        dark: true,
        colors: {
          'primary': '#66BB6A',
          'primary-darken-1': '#4CAF50',
          'primary-lighten-1': '#81C784',
          'secondary': '#9CCC65',
          'secondary-darken-1': '#8BC34A',
          'secondary-lighten-1': '#AED581',
          'accent': '#69F0AE',
          'error': '#FF5252',
          'info': '#90CAF9',
          'success': '#66BB6A',
          'warning': '#FFD54F',
          'surface': '#1E1E1E',
          'on-surface': '#E6E1E5',
          'background': '#121212',
          'on-background': '#E6E1E5',
        },
      },
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1145,
      xl: 1545,
      xxl: 2138,
    },
  },
})
