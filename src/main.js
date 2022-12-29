import 'regenerator-runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './renderer/router'
import store from './renderer/store'
import vuetify from './renderer/plugins/vuetify'
import AppLayout from './renderer/layouts/AppLayout'
import { createSimpleTransition } from 'vuetify/lib/components/transitions/createTransition'

export const VScaleTransitionReverse = createSimpleTransition('scale-transition-reverse');
export const eventBus = new Vue();

Vue.component('AppLayout', AppLayout)
Vue.component('scale-transition-reverse', VScaleTransitionReverse)
Vue.config.productionTip = false

  new Vue({
    store,
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app')

