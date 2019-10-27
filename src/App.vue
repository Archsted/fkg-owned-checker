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

            <div class="pl-4 pr-3 mt-5">
                <div id="summary">
                    <img src="@/assets/images/flowerpot_6.png" width="70" alt="★6">

                    <div style="right:79px;" class="summary-number">
                        <strong>{{ownedRate.rarity6}}</strong><span>%</span>
                    </div>
                    <div style="right:83px;" class="summary-count">
                        ({{ownedCount.rarity6}}/{{allRarity6GachaCharacters.length}})
                    </div>

                    <img src="@/assets/images/flowerpot_5.png" width="70" alt="★5" style="margin-left: 20px;">
                    <div style="right:-11px;" class="summary-number">
                        <strong>{{ownedRate.rarity5}}</strong><span>%</span>
                    </div>
                    <div style="right:-7px;" class="summary-count">
                        ({{ownedCount.rarity5}}/{{allRarity5GachaCharacters.length}})
                    </div>
                </div>
            </div>

            <v-btn fab light depressed @click.native="openTwitter" class="mt-5">
                <v-icon color="#00acee" medium style="height:28px !important;">fab fa-twitter</v-icon>
            </v-btn>

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
                    all: this.selectedIds.length,
                    rarity6: this.selectedRarity6GachaCharacter.length,
                    rarity5: this.selectedRarity5GachaCharacter.length,
                }
            },
            ownedRate() {
                if (this.isReady) {
                    return {
                        all: Math.floor(this.ownedCount.all / this.allCharacters('id').length * 100),
                        rarity6: Math.floor((this.ownedCount.rarity6 / this.allRarity6GachaCharacters.length) * 100),
                        rarity5: Math.floor((this.ownedCount.rarity5 / this.allRarity5GachaCharacters.length) * 100),
                    }
                } else {
                    return {
                        all: ' - ',
                        rarity6: ' - ',
                        rarity5: ' - ',
                    }
                }
            },
            selectedRarity6GachaCharacter() {
                const characters = this.allRarity6GachaCharacters

                return characters.filter(character => {
                    return this.selectedIds.includes(character.id)
                })
            },
            selectedRarity5GachaCharacter() {
                const characters = this.allRarity5GachaCharacters

                return characters.filter(character => {
                    return this.selectedIds.includes(character.id)
                })
            },
            twitterLink() {
                return `https://twitter.com/share?url=${location.href}`
                    + `&hashtags=花騎士,フラワーナイトガール`
                    + `&text=${this.twitterText}%0a`
            },
            twitterText() {
                const sum = (this.allRarity6GachaCharacters.length) + (this.allRarity5GachaCharacters.length)

                return encodeURI(`現在の花騎士ガチャ限キャラ所有率は${this.ownedRate.all}% (${this.ownedCount.all}/${sum})です。`) + `%0a` +
                    encodeURI(`★6: ${this.ownedRate.rarity6}% (${this.ownedCount.rarity6}/${this.allRarity6GachaCharacters.length})  ` +
                        `★5: ${this.ownedRate.rarity5}% (${this.ownedCount.rarity5}/${this.allRarity5GachaCharacters.length})`)
            },
            ...mapGetters('Character', [
                'allCharacters',
                'targetCharacters',
                'allRarity6GachaCharacters',
                'allRarity5GachaCharacters',
            ]),
            ...mapGetters('Setting', [
                'sortItem',
            ]),
            ...mapGetters('User', [
                'selectedIds',
                'selectedIdsQuery'
            ]),
            ...mapState('Setting', [
                'keyword',
                'isGroupedByYear',
                'isShowLimited',
            ]),
        },
        methods: {
            loadLocalStorage() {
                this.SET_SORT_ITEM(this.$localStorage.get('sortItem'))
                this.SET_IS_SHOW_LIMITED(this.$localStorage.get('isShowLimited'))
                this.drawer = this.$localStorage.get('drawer')
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
        }
    }
</script>

<style scoped>
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

    #summary {
        width: 170px;
        position: relative;
        margin-top: -10px;
        text-align: right;
    }

    .summary-number {
        position:absolute;
        top:26px;
        /*left:0;*/
        text-align: center;
        width:80px;
        /*background-color:rgba(255,0,0,0.4);*/


        text-shadow:
            white 2px 0px 0px, white -2px 0px 0px,
            white 0px -2px 0px, white 0px 2px 0px,
            white 2px 2px 0px, white -2px 2px 0px,
            white 2px -2px 0px, white -2px -2px 0px,
            white 1px 2px 0px, white -1px 2px 0px,
            white 1px -2px 0px, white -1px -2px 0px,
            white 2px 1px 0px, white -2px 1px 0px,
            white 2px -1px 0px, white -2px -1px 0px,
            white 1px 1px 0px, white -1px 1px 0px,
            white 1px -1px 0px, white -1px -1px 0px;

        color: red;
    }

    .summary-number strong {
        font-size: 220%;
    }

    .summary-number span {
        font-size:120%;
    }

    .summary-count {
        position: absolute;
        bottom: -13px;
        text-align: center;
        width: 80px;

        font-size: 90%;

        text-shadow:
            black 2px 0px 0px, black -2px 0px 0px,
            black 0px -2px 0px, black 0px 2px 0px,
            black 2px 2px 0px, black -2px 2px 0px,
            black 2px -2px 0px, black -2px -2px 0px,
            black 1px 2px 0px, black -1px 2px 0px,
            black 1px -2px 0px, black -1px -2px 0px,
            black 2px 1px 0px, black -2px 1px 0px,
            black 2px -1px 0px, black -2px -1px 0px,
            black 1px 1px 0px, black -1px 1px 0px,
            black 1px -1px 0px, black -1px -1px 0px;

        color: white;
    }
</style>
