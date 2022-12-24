// Styles
// import '../../styles/main.sass'


// Locale
// import { en } from '../locale'

// Colors
import colors from 'vuetify/lib/util/colors'

export const taskboxTheme = {
  breakpoint: {
    scrollBarWidth: 0,
    thresholds: {
      xs: 600,
      sm: 960,
      md: 1280,
      lg: 1920,
    },
  },
  icons: {
    iconfont: 'mdi',
    values: {},
  },
  // lang: {
  //   current: 'en',
  //   locales: { en },
  //   t: undefined,
  // },
  rtl: false,
  theme: {
    dark: false,
    default: 'light',
    disable: false,
    options: {
      cspNonce: undefined,
      customProperties: undefined,
      minifyTheme: undefined,
      themeCache: undefined,
    },
    themes: {
      
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',

        workspace:colors.grey,

        unstarted:colors.grey.lighten3,
        unstarted_lighter:colors.grey.lighten2,
        unstarted_darker:colors.grey.darken2,
        working:colors.blue.base,
        working_lighter:colors.blue.lighten1,
        working_darker:colors.blue.darken2,
        canceled:colors.red.base,
        canceled_lighter:colors.red.lighten1,
        canceled_darker:colors.red.darken2,
        reviewing:colors.yellow.base,
        reviewing_lighter:colors.yellow.lighten1,
        reviewing_darker:colors.yellow.darken2,
        paused:colors.orange.base,
        paused_lighter:colors.orange.lighten1,
        paused_darker:colors.orange.darken2,
        done:colors.green.base,
        done_lighter:colors.green.lighten2,
        done_darker:colors.green.darken2,

      },
      dark: {
        primary: '#2196F3',
        secondary: '#424242',
        accent: '#FF4081',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',

        workspace:colors.grey.darken4,
        unstarted:colors.grey.lighten3,
        unstarted_lighter:colors.grey.lighten1,
        unstarted_darker:colors.grey.darken2,
        working:colors.blue.base,
        working_lighter:colors.blue.lighten1,
        working_darker:colors.blue.darken2,
        canceled:colors.red.base,
        canceled_lighter:colors.red.lighten1,
        canceled_darker:colors.red.darken2,
        paused:colors.orange.base,
        paused_lighter:colors.orange.lighten1,
        paused_darker:colors.orange.darken2,
        done:colors.green.base,
        done_lighter:colors.green.lighten2,
        done_darker:colors.green.darken2,
        
      },
    },
  },
}