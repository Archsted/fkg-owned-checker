<template>
    <div>
        <chara-list-rarity group="gacha6" v-show="isShowRarity6Gacha && !isGroupedByYear" />
        <chara-list-rarity group="gacha5" v-show="isShowRarity5Gacha && !isGroupedByYear" />
        <chara-list-rarity group="rainbow-medal" v-show="isShowRainbowMedal && !isGroupedByYear" />
        <chara-list-rarity-grouped-by-year group="gacha6" v-show="isShowRarity6Gacha && isGroupedByYear" />
        <chara-list-rarity-grouped-by-year group="gacha5" v-show="isShowRarity5Gacha && isGroupedByYear" />
        <chara-list-rarity-grouped-by-year group="rainbow-medal" v-show="isShowRainbowMedal && isGroupedByYear" />
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    import CharaListRarity from './CharaListRarity'
    import CharaListRarityGroupedByYear from "./CharaListRarityGroupedByYear";

    export default {
        data: () => ({

        }),
        created() {
            this.$emit('historyInit')
        },
        computed: {
            ...mapState('Setting', [
                'isShowRarity6Gacha',
                'isShowRainbowMedal',
                'isShowRarity5Gacha',
                'isGroupedByYear',
            ]),
        },
        components: {
            CharaListRarity,
            CharaListRarityGroupedByYear,
        }
    }
</script>

<style scoped>

</style>