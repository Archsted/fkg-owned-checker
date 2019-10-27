import util from '@/assets/util'

const state = {
    selected: [],
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
