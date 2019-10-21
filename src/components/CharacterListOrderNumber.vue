<template>
    <div>
        <!--
        <div class="pt-2">
            <v-btn
                small
                outline
                round
                @click="checkAll({})"
            >全てを選択する</v-btn>

            <v-btn
                small
                outline
                round
                @click="uncheckAll({})"
            >全ての選択を解除する</v-btn>
        </div>
        -->

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