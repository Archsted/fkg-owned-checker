<template>
    <div>
        <v-subheader>入手タイプ</v-subheader>

        <v-list dense subheader>
            <v-list-tile>
                <v-list-tile-content class="custom-tile-content">
                    <v-checkbox
                        v-model="isCheckShowRarity6Gacha"
                        :label="`★★★★★★（ガチャ）`"
                        color="deep-orange lighten-2"
                        :ripple="false"
                    ></v-checkbox>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-content class="custom-tile-content">
                    <v-checkbox
                        v-model="isCheckShowRarity5Gacha"
                        :label="`★★★★★（ガチャ）`"
                        color="deep-orange lighten-2"
                        :ripple="false"
                    ></v-checkbox>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-divider />

        <v-subheader>所持状況</v-subheader>

        <v-list dense subheader>
            <v-list-tile>
                <v-list-tile-content class="custom-tile-content">
                    <v-radio-group v-model="showOwnedValue">
                        <v-radio
                            :label="`全て表示する`"
                            :value="0"
                            color="deep-orange lighten-2"
                            :ripple="false"
                        ></v-radio>
                    </v-radio-group>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-layout>
            <v-flex d-flex xs12 sm6>
                <v-list dense subheader>
                    <v-list-tile>
                        <v-list-tile-content class="custom-tile-content">
                            <v-radio-group v-model="showOwnedValue">
                                <v-radio
                                    :label="`所持`"
                                    :value="1"
                                    color="deep-orange lighten-2"
                                    :ripple="false"
                                ></v-radio>
                            </v-radio-group>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-flex>
            <v-flex d-flex xs12 sm6>
                <v-list dense subheader>
                    <v-list-tile>
                        <v-list-tile-content class="custom-tile-content">
                            <v-radio-group v-model="showOwnedValue">
                                <v-radio
                                    :label="`未所持`"
                                    :value="2"
                                    color="deep-orange lighten-2"
                                    :ripple="false"
                                ></v-radio>
                            </v-radio-group>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-flex>
        </v-layout>

        <v-divider />

        <v-subheader>属性</v-subheader>

        <v-list dense subheader>
            <v-list-tile>
                <v-list-tile-content class="custom-tile-content">
                    <v-radio-group v-model="showTypeValue">
                        <v-radio
                            :label="`全て表示する`"
                            :value="0"
                            color="deep-orange lighten-2"
                            :ripple="false"
                        ></v-radio>
                    </v-radio-group>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-layout>
            <v-flex d-flex xs12 sm6>
                <v-list dense subheader>
                    <v-list-tile>
                        <v-list-tile-content class="custom-tile-content">
                            <v-radio-group v-model="showTypeValue">
                                <v-radio
                                    :value="1"
                                    color="deep-orange lighten-2"
                                    :ripple="false"
                                >
                                    <template v-slot:label>
                                        <img src="@/assets/images/type_slash.png" alt="斬属性" class="ml-2">
                                    </template>
                                </v-radio>
                            </v-radio-group>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content class="custom-tile-content">
                            <v-radio-group v-model="showTypeValue">
                                <v-radio
                                    :value="3"
                                    color="deep-orange lighten-2"
                                    :ripple="false"
                                >
                                    <template v-slot:label>
                                        <img src="@/assets/images/type_pierce.png" alt="突属性" class="ml-2">
                                    </template>
                                </v-radio>
                            </v-radio-group>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-flex>
            <v-flex d-flex xs12 sm6>
                <v-list dense subheader>
                    <v-list-tile>
                        <v-list-tile-content class="custom-tile-content">
                            <v-radio-group v-model="showTypeValue">
                                <v-radio
                                    :value="2"
                                    color="deep-orange lighten-2"
                                    :ripple="false"
                                >
                                    <template v-slot:label>
                                        <img src="@/assets/images/type_blunt.png" alt="打属性" class="ml-2">
                                    </template>
                                </v-radio>
                            </v-radio-group>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content class="custom-tile-content">
                            <v-radio-group v-model="showTypeValue">
                                <v-radio
                                    :value="4"
                                    color="deep-orange lighten-2"
                                    :ripple="false"
                                >
                                    <template v-slot:label>
                                        <img src="@/assets/images/type_magic.png" alt="魔属性" class="ml-2">
                                    </template>
                                </v-radio>
                            </v-radio-group>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-flex>
        </v-layout>

        <v-divider />

        <v-layout justify-space-between>
            <v-flex d-flex xs12 sm7>
                <v-subheader>期間限定キャラ</v-subheader>
            </v-flex>
            <v-flex d-flex xs12 sm5>
                <v-list-tile-action>
                    <div style="text-align:right;">
                        <v-switch
                            v-model="isSwitchShowLimited"
                            :label="`表示`"
                            color="deep-orange lighten-2"
                        ></v-switch>
                    </div>
                </v-list-tile-action>
            </v-flex>
        </v-layout>

        <v-divider />

        <div v-show="$route.name === 'CharacterListOrderNumber'">
            <v-layout justify-space-between>
                <v-flex d-flex xs12 sm4>
                    <v-subheader>並び順</v-subheader>
                </v-flex>
                <v-flex d-flex xs12 sm8>
                    <v-list-tile-action>
                        <div style="text-align:right;">
                            <v-select
                                v-model="selectSortItem"
                                :items="sortItems"
                                item-text="text"
                                item-value="value"
                                solo
                                hide-details
                                flat
                            ></v-select>
                        </div>
                    </v-list-tile-action>
                </v-flex>
            </v-layout>

            <v-divider />

            <v-layout justify-space-between>
                <v-flex d-flex xs12 sm7>
                    <v-subheader>実装年で分類</v-subheader>
                </v-flex>
                <v-flex d-flex xs12 sm5>
                    <v-list-tile-action>
                        <div style="text-align:right;">
                            <v-switch
                                v-model="isSwitchGroupedByYear"
                                :label="`する`"
                                color="deep-orange lighten-2"
                            ></v-switch>
                        </div>
                    </v-list-tile-action>
                </v-flex>
            </v-layout>
            <v-divider />
        </div>

        <v-layout justify-space-between>
            <v-flex d-flex xs12 sm5>
                <v-subheader>連絡先</v-subheader>
            </v-flex>
            <v-flex d-flex xs12 sm7>
                <v-list-tile-action>
                    <div style="text-align:right;">
                        会長 (<a href="https://twitter.com/etude_kaicho" target="_blank">@etude_kaicho</a>)
                    </div>
                </v-list-tile-action>
            </v-flex>
        </v-layout>
        <v-layout justify-space-between>
            <v-flex d-flex xs12>
                <v-list-tile-action>
                    <img src="@/assets/images/friendpt.png" alt="戦友PT" width="260" style="padding-left:10px;">
                </v-list-tile-action>
            </v-flex>
        </v-layout>

    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex'

    export default {
        data: () => ({
            showOwnedValue: 0,
            showTypeValue: 0,

            isCheckedTypeSlash: false,
            isCheckedTypeBlunt: false,
            isCheckedTypePierce: false,
            isCheckedTypeMagic: false,

            sortItems: [
                {text: '実装が古い順', value: 'id:asc'},
                {text: '実装が新しい順', value: 'id:desc'},
            ],
        }),
        computed: {
            isShowTypeAll: {
                get() {
                    return (this.isShowTypeSlash && this.isShowTypeBlunt && this.isShowTypePierce && this.isShowTypeMagic)
                },
            },
            isCheckShowRarity6Gacha: {
                get() {
                    return this.isShowRarity6Gacha
                },
                set(newValue) {
                    this.SET_IS_SHOW_RARITY_6_GACHA(newValue)
                },
            },
            isCheckShowRarity5Gacha: {
                get() {
                    return this.isShowRarity5Gacha
                },
                set(newValue) {
                    this.SET_IS_SHOW_RARITY_5_GACHA(newValue)
                },
            },
            isSwitchShowLimited: {
                get() {
                    return this.isShowLimited
                },
                set(newValue) {
                    this.SET_IS_SHOW_LIMITED(newValue)
                },
            },
            isSwitchGroupedByYear: {
                get() {
                    return this.isGroupedByYear
                },
                set(newValue) {
                    this.SET_IS_GROUPED_BY_YEAR(newValue)
                }
            },
            selectSortItem: {
                get() {
                    return this.sortItem
                },
                set(newValue) {
                    this.SET_SORT_ITEM(newValue)
                }
            },
            ...mapState('Setting', [
                'isShowRarity6Gacha',
                'isShowRarity5Gacha',
                'isShowLimited',
                'isShowOwned',
                'isShowUnowned',
                'isShowTypeSlash',
                'isShowTypeBlunt',
                'isShowTypePierce',
                'isShowTypeMagic',
                'isGroupedByYear',
            ]),
            ...mapGetters('Setting', [
                'sortItem',
            ])
        },
        methods: {
            selectShowOwnedAndUnowned() {
                this.SET_IS_SHOW_OWNED(true)
                this.SET_IS_SHOW_UNOWNED(true)
            },
            selectShowOwned() {
                this.SET_IS_SHOW_OWNED(true)
                this.SET_IS_SHOW_UNOWNED(false)
            },
            selectShowUnowned() {
                this.SET_IS_SHOW_OWNED(false)
                this.SET_IS_SHOW_UNOWNED(true)
            },
            selectShowTypeAll() {
                this.SET_IS_SHOW_TYPE_SLASH(true)
                this.SET_IS_SHOW_TYPE_BLUNT(true)
                this.SET_IS_SHOW_TYPE_PIERCE(true)
                this.SET_IS_SHOW_TYPE_MAGIC(true)
            },
            selectShowTypeSlash() {
                this.SET_IS_SHOW_TYPE_SLASH(true)
                this.SET_IS_SHOW_TYPE_BLUNT(false)
                this.SET_IS_SHOW_TYPE_PIERCE(false)
                this.SET_IS_SHOW_TYPE_MAGIC(false)
            },
            selectShowTypeBlunt() {
                this.SET_IS_SHOW_TYPE_SLASH(false)
                this.SET_IS_SHOW_TYPE_BLUNT(true)
                this.SET_IS_SHOW_TYPE_PIERCE(false)
                this.SET_IS_SHOW_TYPE_MAGIC(false)
            },
            selectShowTypePierce() {
                this.SET_IS_SHOW_TYPE_SLASH(false)
                this.SET_IS_SHOW_TYPE_BLUNT(false)
                this.SET_IS_SHOW_TYPE_PIERCE(true)
                this.SET_IS_SHOW_TYPE_MAGIC(false)
            },
            selectShowTypeMagic() {
                this.SET_IS_SHOW_TYPE_SLASH(false)
                this.SET_IS_SHOW_TYPE_BLUNT(false)
                this.SET_IS_SHOW_TYPE_PIERCE(false)
                this.SET_IS_SHOW_TYPE_MAGIC(true)
            },
            ...mapMutations('Setting', [
                'SET_IS_SHOW_RARITY_6_GACHA',
                'SET_IS_SHOW_RARITY_5_GACHA',
                'SET_IS_SHOW_LIMITED',
                'SET_IS_SHOW_OWNED',
                'SET_IS_SHOW_UNOWNED',
                'SET_IS_SHOW_TYPE_SLASH',
                'SET_IS_SHOW_TYPE_BLUNT',
                'SET_IS_SHOW_TYPE_PIERCE',
                'SET_IS_SHOW_TYPE_MAGIC',
                'SET_IS_GROUPED_BY_YEAR',
                'SET_SORT_ITEM',
            ]),
        },
        watch: {
            showTypeValue(newValue) {
                switch (newValue) {
                    case 0:
                        this.selectShowTypeAll()
                        break;
                    case 1:
                        this.selectShowTypeSlash()
                        break;
                    case 2:
                        this.selectShowTypeBlunt()
                        break;
                    case 3:
                        this.selectShowTypePierce()
                        break;
                    case 4:
                        this.selectShowTypeMagic()
                        break;
                }
            },
            showOwnedValue(newValue) {
                switch (newValue) {
                    case 0:
                        this.selectShowOwnedAndUnowned()
                        break;
                    case 1:
                        this.selectShowOwned()
                        break;
                    case 2:
                        this.selectShowUnowned()
                        break;
                }
            },
        },
    }
</script>

<style scoped>

_::-webkit-full-page-media, _:future, :root .custom-tile-content {
    border: solid 2px red;
    margin-top: 0 !important;
}

</style>