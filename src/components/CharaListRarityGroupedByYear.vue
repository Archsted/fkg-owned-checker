<template>
    <div class="rarity-wrapper pa-3 mb-1 mx-1">
        <span class="display-1">★{{rarity}}</span>
        <div v-for="year in years" :key="`rarity-${rarity}-${year}`">
            <v-subheader class="px-0">
                <span class="headline">{{year}}年</span>
                <span class="ml-4">表示中のキャラを</span>
                <v-btn
                    small
                    outline
                    round
                    @click="checkAll({rarity: rarity, year:year})"
                    color="green darken-3"
                >
                    <v-icon class="pr-1" color="success">add_circle</v-icon>
                    全て選択
                </v-btn>
                <v-btn
                    small
                    outline
                    round
                    @click="uncheckAll({rarity: rarity, year:year})"
                    color="red darken-3"
                >
                    <v-icon class="pr-1" color="error">remove_circle</v-icon>
                    全ての選択を解除
                </v-btn>
            </v-subheader>

            <div class="character-icon-list pl-4">
                <character-icon
                    v-for="character in targetCharacters({rarity: rarity, year: year, sort: sortItem})"
                    :key="`character-icon-${character.id}`"
                    :chara-data="character"
                    :active="isSelectedCharacterId(character.id)"
                    v-show="isShowCharacterIcon(character.id)"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex'

    import CharacterIcon from './CharacterIcon'

    export default {
        data: () => ({

        }),
        props: {
            rarity: {
                type: Number,
                required: true,
                validator: value => {
                    return value >= 1 && value <= 6
                },
            },
        },
        components: {
            CharacterIcon
        },
        computed: {
            ...mapState('Setting', [
                'isShowOwned',
                'isShowUnowned',
            ]),
            ...mapGetters('User', [
                'selectedIds',
            ]),
            ...mapGetters('Character', [
                'targetCharacters',
            ]),
            ...mapGetters('Setting', [
                'sortItem',
                'years',
            ]),
        },
        methods: {
            selectedCharactersByCondition(condition) {
                const characters = this.targetCharacters(condition)

                return characters.filter(character => {
                    return this.selectedIds.includes(character.id)
                })
            },

            isSelectedCharacterId(id) {
                return this.selectedIds.includes(id)
            },

            isShowCharacterIcon(id) {
                const isSelectedCharacter = this.isSelectedCharacterId(id)
                return ((isSelectedCharacter && this.isShowOwned) || (!isSelectedCharacter && this.isShowUnowned))
            },

            checkAll(condition) {
                this.bulkSelectIds(condition)
            },
            uncheckAll(condition) {
                this.bulkSelectIds(condition, false)
            },
            bulkSelectIds(condition, isAdd = true) {
                const set = new Set(this.selectedIds)

                const characters = this.targetCharacters(condition)

                if (isAdd) {
                    // 追加するとき
                    characters.forEach(character => {
                        set.add(character.id)
                    })
                } else {
                    // 削除するとき
                    const targetCharacterIds = characters.map(character => character.id)

                    set.forEach(id => {
                        if (targetCharacterIds.includes(id)) {
                            set.delete(id)
                        }
                    })
                }

                this.SET_SELECTED(Array.from(set.values()))

//                this.replaceHistoryState()
            },
            ...mapMutations('User', [
                'SET_SELECTED',
            ]),
        },
    }
</script>

<style scoped>
    .character-icon-list {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .v-subheader {
        color: rgba(30, 30, 30, 1) !important;
    }

    .subheader-year {
        border-left: solid 6px red;
    }
</style>