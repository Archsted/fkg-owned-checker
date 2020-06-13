import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)
import '@/assets/tooltip.css'
import '@/assets/character-icon-gacha6.css'
import '@/assets/character-icon-gacha5.css'
import '@/assets/character-icon-rainbow-medal.css'
import '@/assets/custom.css'

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

import '@fortawesome/fontawesome-free/css/all.css'

import GlobalVariables from '@/assets/GlobalVariables'
Vue.mixin(GlobalVariables)

new Vue({
    localStorage: {
        drawer: {
            type: Boolean,
            default: true,
        },
        sortItem: {
            type: String,
            default: 'id:asc',
        },
        isShowLimited: {
            type: Boolean,
            default: true,
        },
    },
    store,
    router,
    render: h => h(App),
}).$mount('#app')
