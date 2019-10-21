import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)
import '@/assets/tooltip.css';
import '@/assets/character-icon.css';

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

import '@fortawesome/fontawesome-free/css/all.css'

import GlobalVariables from '@/assets/GlobalVariables'
Vue.mixin(GlobalVariables)

new Vue({
    localStorage: {
        saves: {
            type: Array,
            default: [
                {
                    name: '',
                    value: null,
                },
                {
                    name: 'セーブ 1',
                    value: null,
                },
                {
                    name: 'セーブ 2',
                    value: null,
                },
                {
                    name: 'セーブ 3',
                    value: null,
                },
                {
                    name: 'セーブ 4',
                    value: null,
                },
            ],
        },
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
