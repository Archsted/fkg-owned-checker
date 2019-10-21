const state = {
    isShowRarity6Gacha: true, // ガチャ虹
    isShowRarity6Other: false, // 虹アルストロメリア, クガイソウ, コルチカム等

    isShowRarity5Gacha: true, // ガチャ金
    isShowRarity5Event: false, // イベ金
    isShowRarity5Other: false, // シリアルナンバー、交換等

    isShowLimited: true, // 期間限定で入手不可能なキャラを表示するかどうか

    isShowOwned: true, // 所持済みのを表示するかどうか
    isShowUnowned: true, // 未所持のものを表示するかどうか

    isShowTypeSlash: true, // 斬属性を表示するかどうか
    isShowTypeBlunt: true, // 打属性を表示するかどうか
    isShowTypePierce: true, // 突属性を表示するかどうか
    isShowTypeMagic: true, // 魔属性を表示するかどうか

    isGroupedByYear: false, // 実装年ごとに表示を分けるかどうか

    sortKey: 'id', // ソートのキー
    sortOrder: 'asc', // ソートのオーダー

    keyword: '',

    yearRange: [],
}

const mutations = {
    SET_IS_SHOW_RARITY_6_GACHA (state, value) {
        state.isShowRarity6Gacha = value
    },
    SET_IS_SHOW_RARITY_5_GACHA (state, value) {
        state.isShowRarity5Gacha = value
    },
    SET_IS_SHOW_LIMITED (state, value) {
        state.isShowLimited = value
    },
    SET_IS_SHOW_OWNED (state, value) {
        state.isShowOwned = value
    },
    SET_IS_SHOW_UNOWNED (state, value) {
        state.isShowUnowned = value
    },
    SET_IS_SHOW_TYPE_SLASH (state, value) {
        state.isShowTypeSlash = value
    },
    SET_IS_SHOW_TYPE_BLUNT (state, value) {
        state.isShowTypeBlunt = value
    },
    SET_IS_SHOW_TYPE_PIERCE (state, value) {
        state.isShowTypePierce = value
    },
    SET_IS_SHOW_TYPE_MAGIC (state, value) {
        state.isShowTypeMagic = value
    },
    SET_IS_GROUPED_BY_YEAR (state, value) {
        state.isGroupedByYear = value
    },
    SET_KEYWORD (state, value) {
        state.keyword = value
    },
    SET_YEAR_RANGE (state, value) {
        state.yearRange = value
    },
    SET_SORT_ITEM (state, value) {
        const [key, order] = value.split(':')
        state.sortKey = key
        state.sortOrder = order
    },
}

const getters = {
    sortItem: state => {
        return `${state.sortKey}:${state.sortOrder}`
    },
    years: state => {
        if (state.sortKey === 'id' && state.sortOrder === 'desc') {
            return state.yearRange.slice().reverse()
        } else {
            return state.yearRange
        }
    }
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
