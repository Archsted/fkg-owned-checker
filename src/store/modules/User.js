import util from '@/assets/util'

const state = {
    selected: [],
    saves: [],
    saveId: 0,
}

const mutations = {
    SET_SELECTED: (state, ids) => {
        state.selected = ids
    },
    ADD_SELECTED: (state, id) => {
        state.selected.push(id)
    },
    REMOVE_SELECTED: (state, id) => {
        state.selected = state.selected.filter(value => {
            return value !== id
        })
    },
    SET_SAVES: (state, saves) => {
        state.saves = saves
    },
    // payloadはindexとsaveを持つ。saveはオブジェクトで更新したいキーと値のみを持つ
    UPDATE_SAVE: (state, payload) => {
        for (let key of Object.keys(payload.save)) {
            state.saves[payload.index][key] = payload.save[key]
        }
    },
    SET_SAVE_ID: (state, id) => {
        state.saveId = id
    },
}

const getters = {
    selectedIds: state => {
        return state.selected.slice().sort( (a, b) => {
            return a - b
        })
    },
    encodedIds: (state, getters) => {
        const selectedIds = getters.selectedIds

        return util.deflateList(selectedIds)
    },
    selectedIdsQuery: (state, getters) => {
        return getters.encodedIds
    },
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
