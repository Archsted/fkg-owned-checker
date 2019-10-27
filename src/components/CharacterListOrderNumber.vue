<template>
    <div>
        <chara-list-rarity :rarity="6" v-show="isShowRarity6Gacha && !isGroupedByYear" />
        <chara-list-rarity :rarity="5" v-show="isShowRarity5Gacha && !isGroupedByYear" />
        <chara-list-rarity-grouped-by-year :rarity="6" v-show="isShowRarity6Gacha && isGroupedByYear" />
        <chara-list-rarity-grouped-by-year :rarity="5" v-show="isShowRarity5Gacha && isGroupedByYear" />
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