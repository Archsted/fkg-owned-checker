<template>
    <div class="name-wrapper pa-3 mb-1 mx-1">
        <div v-for="initial in initials" :key="`initial-${initial}`" class="initial-wrapper">
            <v-subheader class="px-2" style="min-height: 72px;">
                <span class="display-1 deep-orange--text">{{initial}}</span>
            </v-subheader>

            <div class="character-icon-list pl-3">
                <character-icon
                    v-for="character in targetCharacters({initial: initial, sort: 'name'})"
                    :key="`character-icon-${character.id}`"
                    :chara-data="character"
                    :active="isSelectedCharacterId(character.id)"
                    v-show="isShowCharacterIcon(character)"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'

    import CharacterIcon from './CharacterIcon'

    export default {
        data: () => ({

        }),
        created() {
            this.$emit('historyInit')
        },
        computed: {
            ...mapState('Setting', [
                'isShowRarity6Gacha',
                'isShowRarity5Gacha',
                'isShowRainbowMedal',
                'isShowOwned',
                'isShowUnowned',
            ]),
            ...mapState('Character', [
                'initials',
            ]),
            ...mapGetters('User', [
                'selectedIds',
            ]),
            ...mapGetters('Character', [
                'targetCharacters',
            ]),
        },
        components: {
            CharacterIcon,
        },
        methods: {
            isSelectedCharacterId(id) {
                return this.selectedIds.includes(id)
            },
            isShowCharacterIcon(character) {
                if (!this.isShowRarity6Gacha && character.group === 'gacha6') {
                    return false
                }

                if (!this.isShowRarity5Gacha && character.group === 'gacha5') {
                    return false
                }

                if (!this.isShowRainbowMedal && character.group === 'rainbow-medal') {
                    return false
                }

                const isSelectedCharacter = this.isSelectedCharacterId(character.id)
                return ((isSelectedCharacter && this.isShowOwned) || (!isSelectedCharacter && this.isShowUnowned))
            },
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

    .initial-wrapper {
        display: flex;
    }
</style>