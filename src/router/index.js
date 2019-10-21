import Vue from 'vue'
import Router from 'vue-router'

import CharacterListOrderNumber from "@/components/CharacterListOrderNumber";
import CharacterListOrderName from "@/components/CharacterListOrderName";

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'CharacterListOrderNumber',
            component: CharacterListOrderNumber,
        },
        {
            path: '/name',
            name: 'CharacterListOrderName',
            component: CharacterListOrderName,
        },
    ],
    scrollBehavior () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0 })
            }, 500)
        })
    },
})
