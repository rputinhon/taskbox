import Vue from 'vue';
import { colors } from 'vuetify/lib';
import Vuetify from 'vuetify/lib/framework';
// import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

const taskBoxPrimaryColor = "#0a90ff";

export default new Vuetify({
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
        primary: taskBoxPrimaryColor,
        secondary: '#424242',
        accent: '#f14884',
        error: '#f14f43',
        info: '#ffa219',
        success: '#81e68b',
        warning: '#f7ab39',
        workspace: '#262629',
        background:'#ebedf5',

        unstarted: '#888',
        unstarted_lighter: colors.grey.lighten1,
        unstarted_darker: colors.grey.darken2,
        working: taskBoxPrimaryColor,
        working_lighter: colors.blue.lighten1,
        working_darker: colors.blue.darken2,
        canceled: '#f14f43',
        canceled_lighter: colors.red.lighten1,
        canceled_darker: colors.red.darken2,
        reviewing: '#f7ab39',
        paused: '#f14884',
        paused_lighter: colors.orange.lighten1,
        paused_darker: colors.orange.darken2,
        done: '#81e68b',
        done_lighter: colors.green.lighten2,
        done_darker: colors.green.darken2,
        open: '#60718b',
        open_lighter: colors.green.lighten2,
        open_darker: colors.green.darken2,
      },
      dark: {
        primary: taskBoxPrimaryColor,
        secondary: '#424242',
        accent: '#f14884',
        error: '#f14f43',
        info: '#ffa219',
        success: '#81e68b',
        warning: '#f7ab39',
        workspace: '#262629',
        background:'#ebedf5',

        unstarted: '#888',
        unstarted_lighter: colors.grey.lighten1,
        unstarted_darker: colors.grey.darken2,
        working: taskBoxPrimaryColor,
        working_lighter: colors.blue.lighten1,
        working_darker: colors.blue.darken2,
        canceled: '#f14f43',
        canceled_lighter: colors.red.lighten1,
        canceled_darker: colors.red.darken2,
        reviewing: '#f7ab39',
        paused: '#f14884',
        paused_lighter: colors.orange.lighten1,
        paused_darker: colors.orange.darken2,
        done: '#81e68b',
        done_lighter: colors.green.lighten2,
        done_darker: colors.green.darken2,
        open: '#60718b',
        open_lighter: colors.green.lighten2,
        open_darker: colors.green.darken2,

      },
    },
  }
});
