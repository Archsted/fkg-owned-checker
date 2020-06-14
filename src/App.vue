<template>
    <v-app>
        <v-navigation-drawer
            v-model="drawer"
            fixed
            clipped
            app
            width="270px"
        >
            <side-bar />
        </v-navigation-drawer>
        <v-toolbar
            color="yellow darken-4"
            clipped-left
            dark
            app
            fixed
            tabs
        >
            <v-toolbar-title class="ml-0 pl-3 pr-3 mr-4">
                <a href="./" class="no-link">花騎士 キャラ所持チェッカー</a>
            </v-toolbar-title>

            <v-text-field
                flat
                solo-inverted
                hide-details
                clearable
                prepend-inner-icon="search"
                v-model="inputKeyword"
                :label="`キャラ名で絞り込み、スペース区切りでAND検索 （例：水着）`"
            ></v-text-field>

            <div class="summary">
                <div
                    v-show="isShowRarity6Gacha"
                    class="summary-list">
                    <div class="summary-list__summary-container">
                        <img class="summary-list__group-image" src="@/assets/images/flowerpot_6.png" width="70" alt="★6">
                        <div class="summary-list__summary-number">
                            <strong>{{ownedRate.rarity6}}</strong><span>%</span>
                        </div>
                        <div class="summary-list__summary-count">
                            ({{ownedCount.rarity6}}/{{allRarity6GachaCharacters.length}})
                        </div>
                    </div>
                </div>

                <div
                    v-show="isShowRarity5Gacha"
                    class="summary-list">
                    <div class="summary-list__summary-container">
                        <img class="summary-list__group-image" src="@/assets/images/flowerpot_5.png" width="70" alt="★5">
                        <div class="summary-list__summary-number">
                            <strong>{{ownedRate.rarity5}}</strong><span class="summary-list__summary-unit">%</span>
                        </div>
                        <div class="summary-list__summary-count">
                            ({{ownedCount.rarity5}}/{{allRarity5GachaCharacters.length}})
                        </div>
                    </div>
                </div>

                <div
                    v-show="isShowRainbowMedal"
                    class="summary-list">
                    <div class="summary-list__summary-container">
                        <img class="summary-list__group-image" src="@/assets/images/rainbow-medal.png" width="70" alt="虹色メダル">
                        <div class="summary-list__summary-number">
                            <strong>{{ownedRate['rainbow-medal']}}</strong><span>%</span>
                        </div>
                        <div class="summary-list__summary-count">
                            ({{ownedCount['rainbow-medal']}}/{{allRainbowMedalCharacters.length}})
                        </div>
                    </div>
                </div>
            </div>

            <div class="social-button">
                <v-btn fab light depressed @click.native="openTwitter">
                    <v-icon color="#00acee" medium style="height:28px !important;">fab fa-twitter</v-icon>
                </v-btn>
            </div>

            <template v-slot:extension>
                <v-toolbar-side-icon
                    @click="drawer = !drawer"
                ></v-toolbar-side-icon>
                <v-tabs
                    color="transparent"
                    fixed-tabs
                    class="pl-5"
                >
                    <v-tabs-slider
                        color="blue darken-2"
                    ></v-tabs-slider>

                    <v-tab :to="{path:`/`}">
                        <v-avatar
                            size="24"
                            class="mr-2"
                        >
                            <v-icon color="yellow">fas fa-star</v-icon>
                        </v-avatar>
                        レアリティ順
                    </v-tab>
                    <v-tab :to="{path:`/name`}">
                        <v-avatar
                            size="24"
                            class="mr-2"
                        >
                            <span class="yellow--text headline font-weight-bold">ア</span>
                        </v-avatar>
                        50音順
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-content>
            <div class="mr-4" style="padding-bottom: 120px;">
                <transition name="fade">
                    <router-view @historyInit="replaceHistoryState"></router-view>
                </transition>
            </div>

            <back-to-top visibleoffset="10" right="16px">
                <v-btn
                    fab
                    color="deep-orange darken-2"
                >
                    <v-icon
                        color="white"
                    >arrow_upward</v-icon>
                </v-btn>
            </back-to-top>
        </v-content>
    </v-app>
</template>

<script>
    import URL from 'url-parse'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import util from '@/assets/util'
    import moment from 'moment'

    import BackToTop from 'vue-backtotop'
    import SideBar from './components/SideBar'

    export default {
        data: () => ({
            isReady: false,
            drawer: true,
        }),
        components: {
            BackToTop,
            SideBar,
        },
        created() {
            this.initYearRange()
            this.readCharacterData()
            this.loadLocalStorage()
            this.restoreSelectedIds()
        },
        computed: {
            inputKeyword: {
                get() {
                    return this.keyword
                },
                set(newValue) {
                    this.SET_KEYWORD(newValue)
                },
            },
            ownedCount() {
                return {
                    'all': this.selectedRarity6GachaCharacter.length + this.selectedRarity5GachaCharacter.length,
                    'rarity6': this.selectedRarity6GachaCharacter.length,
                    'rarity5': this.selectedRarity5GachaCharacter.length,
                    'rainbow-medal' : this.selectedRainbowMedalCharacter.length,
                }
            },
            ownedRate() {
                if (this.isReady) {
                    return {
                        'all': Math.floor(this.ownedCount.all / (this.allRarity6GachaCharacters.length + this.allRarity5GachaCharacters.length) * 100),
                        'rarity6': Math.floor((this.ownedCount.rarity6 / this.allRarity6GachaCharacters.length) * 100),
                        'rarity5': Math.floor((this.ownedCount.rarity5 / this.allRarity5GachaCharacters.length) * 100),
                        'rainbow-medal': Math.floor((this.ownedCount['rainbow-medal'] / this.allRainbowMedalCharacters.length) * 100),
                    }
                } else {
                    return {
                        'all': ' - ',
                        'rarity6': ' - ',
                        'rarity5': ' - ',
                        'rainbow-medal': ' - ',
                    }
                }
            },
            selectedRarity6GachaCharacter() {
                const characters = this.allRarity6GachaCharacters

                return characters.filter(character => {
                    return (this.selectedIds.includes(character.id))
                })
            },
            selectedRarity5GachaCharacter() {
                const characters = this.allRarity5GachaCharacters

                return characters.filter(character => {
                    return (this.selectedIds.includes(character.id))
                })
            },
            selectedRainbowMedalCharacter() {
                const characters = this.allRainbowMedalCharacters

                return characters.filter(character => {
                    return (this.selectedIds.includes(character.id))
                })
            },
            twitterLink() {
                return `https://twitter.com/share?url=${location.href}`
                    + `&hashtags=花騎士,フラワーナイトガール`
                    + `&text=${this.twitterText}`
            },
            twitterText() {
                let text = encodeURI(`現在の花騎士キャラ所有率は`) + `%0a`

                if (this.isShowRarity6Gacha) {
                    text = text + encodeURI(`★6(ガチャ限): ${this.ownedRate.rarity6}% (${this.ownedCount.rarity6}/${this.allRarity6GachaCharacters.length})`) + `%0a`
                }

                if (this.isShowRarity5Gacha) {
                    text = text + encodeURI(`★5(ガチャ限): ${this.ownedRate.rarity5}% (${this.ownedCount.rarity5}/${this.allRarity5GachaCharacters.length})`) + `%0a`
                }

                if (this.isShowRainbowMedal) {
                    text = text + encodeURI(`虹色メダル: ${this.ownedRate['rainbow-medal']}% (${this.ownedCount['rainbow-medal']}/${this.allRainbowMedalCharacters.length})`) + `%0a`
                }

                return text
            },
            ...mapGetters('Character', [
                'allCharacters',
                'targetCharacters',
                'allRarity6GachaCharacters',
                'allRarity5GachaCharacters',
                'allRainbowMedalCharacters',
            ]),
            ...mapGetters('Setting', [
                'sortItem',
            ]),
            ...mapGetters('User', [
                'selectedIds',
                'selectedIdsQuery'
            ]),
            ...mapState('Setting', [
                'isShowRarity6Gacha',
                'isShowRainbowMedal',
                'isShowRarity5Gacha',
                'keyword',
                'isGroupedByYear',
                'isShowLimited',
            ]),
        },
        methods: {
            loadLocalStorage() {
                this.SET_SORT_ITEM(this.$localStorage.get('sortItem'))
                this.drawer = this.$localStorage.get('drawer')
                this.SET_IS_SHOW_RARITY_6_GACHA(this.$localStorage.get('isShowRarity6Gacha', true, Boolean))
                this.SET_IS_SHOW_RARITY_5_GACHA(this.$localStorage.get('isShowRarity5Gacha', true, Boolean))
                this.SET_IS_SHOW_RAINBOW_MEDAL(this.$localStorage.get('isShowRainbowMedal', false, Boolean))
                this.SET_IS_SHOW_LIMITED(this.$localStorage.get('isShowLimited'))
            },
            restoreSelectedIds() {
                const url = new URL(location.href)

                const param = url.query.replace('?', '')

                if (param) {
                    this.SET_SELECTED(util.inflateList(param))
                }
            },
            readCharacterData() {
                util.getCharacterData()
                    .then( characters => {
                        this.initCharacters(characters)
                        this.isReady = true
                    })
                    .catch( () => {
                        // エラー
                    })
            },
            initYearRange() {
                const startYear = 2015 // 花騎士のサービス開始年
                const years = []

                for (let year = startYear; year <= moment().year(); year++) {
                    years.push(year)
                }

                this.SET_YEAR_RANGE(years)
            },
            /**
             * ブラウザのURLを書き換える
             */
            replaceHistoryState() {
                const url = new URL(location.href)

                if (this.selectedIdsQuery) {
                    history.replaceState(null, null, `${url.pathname}?${this.selectedIdsQuery}`)
                } else {
                    history.replaceState(null, null, url.pathname)
                }
            },
            openTwitter() {
                window.open(this.twitterLink, '_blank')
            },

            ...mapMutations('User', [
                'SET_SELECTED',
            ]),
            ...mapMutations('Character', [
                'SET_CHARACTERS',
                'SET_CHARACTERS_ORDER_BY_ID',
                'SET_CHARACTERS_ORDER_BY_NAME',
            ]),
            ...mapActions('Character', [
                'initCharacters',
            ]),
            ...mapMutations('Setting', [
                'SET_IS_SHOW_RARITY_6_GACHA',
                'SET_IS_SHOW_RARITY_5_GACHA',
                'SET_IS_SHOW_RAINBOW_MEDAL',
                'SET_KEYWORD',
                'SET_YEAR_RANGE',
                'SET_SORT_ITEM',
                'SET_IS_SHOW_LIMITED',
            ])
        },
        watch: {
            sortItem(newValue) {
                this.$localStorage.set('sortItem', newValue)
            },
            isShowLimited(newValue) {
                this.$localStorage.set('isShowLimited', newValue)
            },
            selectedIdsQuery() {
                this.replaceHistoryState()
            },
            drawer(newValue) {
                this.$localStorage.set('drawer', newValue)
            },
            isShowRarity6Gacha(newValue) {
                this.$localStorage.set('isShowRarity6Gacha', newValue)
            },
            isShowRarity5Gacha(newValue) {
                this.$localStorage.set('isShowRarity5Gacha', newValue)
            },
            isShowRainbowMedal(newValue) {
                this.$localStorage.set('isShowRainbowMedal', newValue)
            },
        }
    }
</script>

<style lang="scss" scoped>
    * {
        text-transform: none !important;
    }
    .material-icons {
        font-family: "Material Icons";
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to  {
        opacity: 0;
    }

    .no-link {
        color: inherit;
        text-decoration: none;
    }

    .summary {
        margin-left: 32px;
        align-self: stretch;
        display: flex;
    }

    .summary-list {
        margin: 10px;

        &__summary-container {
            position: relative;
            width: 70px;
            height: 98px;
            padding-bottom: 20px;
            display: flex;
            align-items: center;
        }

        &__group-image {

        }

        &__summary-number {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin-top: -2px;
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ff0000;

            text-shadow:
                #ffffff 2px 0 0, #ffffff -2px 0 0,
                #ffffff 0 -2px 0, #ffffff 0 2px 0,
                #ffffff 2px 2px 0, #ffffff -2px 2px 0,
                #ffffff 2px -2px 0, #ffffff -2px -2px 0,
                #ffffff 1px 2px 0, #ffffff -1px 2px 0,
                #ffffff 1px -2px 0, #ffffff -1px -2px 0,
                #ffffff 2px 1px 0, #ffffff -2px 1px 0,
                #ffffff 2px -1px 0, #ffffff -2px -1px 0,
                #ffffff 1px 1px 0, #ffffff -1px 1px 0,
                #ffffff 1px -1px 0, #ffffff -1px -1px 0;

            strong {
                font-size: 220%;
            }

            span {
                position: relative;
                bottom: -6px;
                left: 3px;
            }
        }

        &__summary-count {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 90%;
            color: #ffffff;
            text-shadow:
                #000000 2px 0 0, #000000 -2px 0 0,
                #000000 0 -2px 0, #000000 0 2px 0,
                #000000 2px 2px 0, #000000 -2px 2px 0,
                #000000 2px -2px 0, #000000 -2px -2px 0,
                #000000 1px 2px 0, #000000 -1px 2px 0,
                #000000 1px -2px 0, #000000 -1px -2px 0,
                #000000 2px 1px 0, #000000 -2px 1px 0,
                #000000 2px -1px 0, #000000 -2px -1px 0,
                #000000 1px 1px 0, #000000 -1px 1px 0,
                #000000 1px -1px 0, #000000 -1px -1px 0;
        }
    }

    .social-button {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        height: 112px;
        margin-left: 6px;
    }

</style>
