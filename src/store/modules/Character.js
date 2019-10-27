import util from '@/assets/util'

const state = {
    characters: [],
    charactersOrderById: [],
    charactersOrderByName: [],
    initials: [],
}

const mutations = {
    SET_CHARACTERS: (state, characters) => {
        state.characters = characters
    },
    SET_CHARACTERS_ORDER_BY_ID: (state, characters) => {
        state.charactersOrderById = characters
    },
    SET_CHARACTERS_ORDER_BY_NAME: (state, characters) => {
        state.charactersOrderByName = characters
    },
    SET_INITIALS: (state, initials) => {
        state.initials = initials
    },
}

const getters = {
    allCharacters: state => sortKey => {
        const [key, order] = sortKey.split(':')
        switch (key) {
            case 'id':
                if (order !== undefined && order === 'desc') {
                    return state.charactersOrderById.slice().reverse()
                } else {
                    return state.charactersOrderById
                }
            case 'name':
                if (order !== undefined && order === 'desc') {
                    return state.charactersOrderByName.slice().reverse()
                } else {
                    return state.charactersOrderByName
                }
            default:
                return state.characters
        }
    },

    allRarity6GachaCharacters: (state, getters) => {
        return getters.allCharacters('id').filter(character => {
            return character.rarity === 6
        })
    },

    allRarity5GachaCharacters: (state, getters) => {
        return getters.allCharacters('id').filter(character => {
            return character.rarity === 5
        })
    },

    targetCharacters: (state, getters, rootState) => condition => {
        const sortKey = condition.hasOwnProperty('sort') ? condition.sort : 'id'

        return getters.allCharacters(sortKey).filter(character => {
            // レアリティ条件
            if (condition.rarity) {
                if (condition.rarity !== character.rarity) {
                    return false
                }
            }

            // 実装年
            if (condition.year) {
                if (condition.year !== character.year) {
                    return false
                }
            }

            // 頭文字
            if (condition.initial) {
                if (new RegExp('^' + condition.initial).test(character.name) === false) {
                    return false
                }
            }

            // キーワード
            if (rootState.Setting.keyword !== null) {
                const keyword = rootState.Setting.keyword.trim()
                if (keyword !== '') {
                    // スペース区切りでAND検索になる
                    const keywords = keyword.split(/\s+/).map(word => {
                        return "(?=.*" + util.convertHiraToKana(word) + ")"
                    })

                    if (new RegExp("^" + keywords.join('')).test(character.name) === false) {
                        return false
                    }
                }
            }

            // 限定
            if (!rootState.Setting.isShowLimited) {
                if (character.isLimited) {
                    return false
                }
            }

            // 属性
            if (!(rootState.Setting.isShowTypeSlash &&
                rootState.Setting.isShowTypeBlunt &&
                rootState.Setting.isShowTypePierce &&
                rootState.Setting.isShowTypeMagic)) {
                if (rootState.Setting.isShowTypeSlash) {
                    if (character.type !== 1) {
                        return false
                    }
                }
                if (rootState.Setting.isShowTypeBlunt) {
                    if (character.type !== 2) {
                        return false
                    }
                }
                if (rootState.Setting.isShowTypePierce) {
                    if (character.type !== 3) {
                        return false
                    }
                }
                if (rootState.Setting.isShowTypeMagic) {
                    if (character.type !== 4) {
                        return false
                    }
                }
            }

            // 他に条件があれば追加

            return true
        })
    }

}

const actions = {
    initCharacters({ commit }, characters) {
        const charactersOrderById = characters.slice().sort((a, b) => {
            return (a.id > b.id) ? 1 : -1
        })
        const charactersOrderByName = characters.slice().sort( (a, b) => {
            return (a.name > b.name) ? 1 : -1
        })

        commit('SET_CHARACTERS', charactersOrderById)
        commit('SET_CHARACTERS_ORDER_BY_ID', charactersOrderById)
        commit('SET_CHARACTERS_ORDER_BY_NAME', charactersOrderByName)

        const allInitials = charactersOrderByName.map( character => character.name.substring(0, 1))
        const uniqueInitials = allInitials.filter( (x, i, self) => {
            return self.indexOf(x) === i
        })
        commit('SET_INITIALS', uniqueInitials)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
