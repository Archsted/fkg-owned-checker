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
                花騎士 キャラ所持チェッカー
            </v-toolbar-title>

            <v-text-field
                flat
                solo-inverted
                hide-details
                clearable
                prepend-inner-icon="search"
                v-model="inputKeyword"
                label="キャラ名で絞り込み、スペース区切りでAND検索"
            ></v-text-field>



            <v-btn fab small light depressed >
                <v-icon color="#00acee">fab fa-twitter</v-icon>
            </v-btn>

            <!--
            <v-toolbar-items>
                <v-tooltip
                    bottom
                    open-delay="0"
                    close-delay="0"
                    tag="div"
                >
                    <template v-slot:activator="{ on }">
                            <v-icon v-on="on" class="ml-4 pt-3 mt-1 mr-2">far fa-question-circle</v-icon>
                    </template>
                    所持キャラの選択状態を複数管理できます。<br>
                    FileAとFileBを管理したい時などにご利用下さい。<br>
                    保存データはブラウザ毎に保存されます。<br>
                    保存名の変更やデータコピーは右側の歯車をクリックして下さい。
                </v-tooltip>

                <v-select
                    dense
                    class="mt-1"
                    single-line
                    hide-details
                    v-model="selectedSaveId"
                    item-value="id"
                    item-text="name"
                    :items="saveItems"
                ></v-select>

                <save-manager-dialog />
            </v-toolbar-items>
            -->

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

                    <v-tab to="/">
                        <v-avatar
                            size="24"
                            class="mr-2"
                        >
                            <v-icon color="yellow">fas fa-star</v-icon>
                        </v-avatar>
                        レアリティ順
                    </v-tab>
                    <v-tab to="/name">
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
                    <router-view></router-view>
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
//    import SaveManagerDialog from "./components/SaveManagerDialog";

    export default {
        data: () => ({
            isReady: false,
            drawer: true,
        }),
        components: {
            BackToTop,
            SideBar,
//            SaveManagerDialog,
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
            selectedSaveId: {
                get() {
                    return this.saveId
                },
                set(newValue) {
                    console.log(newValue)
                    this.SET_SAVE_ID(newValue)
                },
            },
            saveItems() {
                // 各内容にidカラムを追加
                let items = []

                this.saves.forEach((save, index) => {
                    let name = save.name

                    if (index === 0) {
                        // URLパラメータを持っていない場合は次のループへ
                        if (!this.hasUrlParam) {
                            return
                        } else {
                            name = this.urlParamSaveName
                        }
                    }

                    items.push({
                        id: index,
                        name: name,
                    })
                })

                return items
            },
            ...mapGetters('Character', [
                'allCharacters',
            ]),
            ...mapGetters('Setting', [
                'sortItem',
            ]),
            ...mapGetters('User', [
                'selectedIdsQuery'
            ]),
            ...mapState('Setting', [
                'keyword',
                'isGroupedByYear',
                'isShowLimited',
            ]),
            ...mapState('User', [
                'saves',
                'saveId',
                'hasUrlParam',
            ])
        },
        methods: {
            loadLocalStorage() {
                this.SET_SORT_ITEM(this.$localStorage.get('sortItem'))
                this.SET_IS_SHOW_LIMITED(this.$localStorage.get('isShowLimited'))
                this.SET_SAVES(this.$localStorage.get('saves'))
                this.drawer = this.$localStorage.get('drawer')
            },
            restoreSelectedIds() {
                const url = new URL(location.href)

                const paramPosition = url.hash.indexOf('?')

                // URLのハッシュに?が含まれている場合
                if (paramPosition !== -1) {
                    this.SET_HAS_URL_PARAM(true)
                    this.SET_SAVE_ID(0)

                    // ?より後ろを選択状態のパラメータと判断
                    this.SET_SELECTED(util.inflateList(url.hash.substring(paramPosition + 1)))

                    // URLのパラメータを削除する
                    location.hash = url.hash.substring(1, paramPosition)
                } else {
                    this.SET_HAS_URL_PARAM(false)
                    this.SET_SAVE_ID(1) // 初期選択セーブ番号はひとまず固定、今後設定に残すことにするかも
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
            selectCharactersFromSave() {
                const ids = this.saves[this.selectedSaveId].value
                if (ids) {
                    this.SET_SELECTED(util.inflateList(this.saves[this.selectedSaveId].value))
                } else {
                    this.SET_SELECTED([])
                }
            },
            initYearRange() {
                const startYear = 2015 // 花騎士のサービス開始年
                const years = []

                for (let year = startYear; year <= moment().year(); year++) {
                    years.push(year)
                }

                this.SET_YEAR_RANGE(years)
            },
            ...mapMutations('User', [
                'SET_SELECTED',
                'SET_SAVES',
                'SET_SAVE_ID',
                'UPDATE_SAVE',
                'SET_HAS_URL_PARAM',
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
            selectedIdsQuery(newValue) {
                this.UPDATE_SAVE({
                    index: this.selectedSaveId,
                    save: {
                        value: newValue
                    }
                })
                this.$localStorage.set('saves', this.saves)
            },
            drawer(newValue) {
                this.$localStorage.set('drawer', newValue)
            },
            selectedSaveId() {
                this.selectCharactersFromSave()
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
</style>
