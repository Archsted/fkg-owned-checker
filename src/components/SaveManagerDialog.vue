<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" max-width="800px" lazy>
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>fas fa-cog</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">セーブ管理</span>
                    <v-spacer></v-spacer>
                    <v-btn icon large @click="dialog = false">
                        <v-icon large>fas fa-times</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-tabs fixed-tabs>
                        <v-tab key="tab-rename">
                            <v-icon color="yellow darken-4" class="mr-2">fas fa-edit</v-icon>名前変更
                        </v-tab>
                        <v-tab key="tab-copy">
                            <v-icon color="yellow darken-4" class="mr-2">fas fa-copy</v-icon> コピー/入れ替え
                        </v-tab>
                        <v-tab-item key="tab-rename">
                            <v-card flat>
                                <v-card-text>
                                    <p>ページ右上のセーブ切り替え部分に表示される名称を変更することができます。</p>

                                    <v-text-field
                                        v-for="save in explicitSaves"
                                        :key="`rename-${save.id}`"
                                        v-model="save.name"
                                        :label="`Save ${save.id}`"
                                        @input="changeSaveName(save.name, save.id)"
                                    ></v-text-field>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="tab-copy">
                            <v-card flat>
                                <v-card-text>
                                    <p>キャラクターの選択状態を、セーブ間でコピーしたり入れ替えたりできます。<br />
                                    コピー元とコピー先、あるいは交換する2つのセーブを選択してください。</p>

                                    <v-select
                                        :items="allSaves"
                                        v-model.number="copyFromId"
                                        item-value="id"
                                        item-text="name"
                                        single-line
                                        hide-details
                                    ></v-select>
                                    <v-select
                                        :items="allSaves"
                                        v-model.number="copyToId"
                                        item-value="id"
                                        item-text="name"
                                        single-line
                                        hide-details
                                    ></v-select>

                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12 sm6>
                                                <v-btn
                                                    color="yellow darken-4"
                                                    class="white--text"
                                                    block
                                                    :disabled="!canCopyOrReplace"
                                                    @click="copySave"
                                                >
                                                    <v-icon left dark>fas fa-arrow-down</v-icon>
                                                    上の内容を下にコピーする
                                                </v-btn>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-btn
                                                    color="yellow darken-4"
                                                    class="white--text"
                                                    block
                                                    :disabled="!canCopyOrReplace"
                                                    @click="replaceSave"
                                                >
                                                    <v-icon left dark>fas fa-arrows-alt-v</v-icon>
                                                    上と下の内容を入れ替える
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>

                    <!--
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <v-text-field label="Legal first name*" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                    label="Legal last name*"
                                    hint="example of persistent helper text"
                                    persistent-hint
                                    required
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Email*" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Password*" type="password" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                    :items="['0-17', '18-29', '30-54', '54+']"
                                    label="Age*"
                                    required
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-autocomplete
                                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                    label="Interests"
                                    multiple
                                ></v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    -->
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="doneDialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">セーブ管理</span>
                    <v-spacer></v-spacer>
                    <v-btn icon large @click="doneDialog = false">
                        <v-icon large>fas fa-times</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    完了しました。
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="doneDialog = false">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import { debounce } from 'lodash';
    import util from '@/assets/util'

    export default {
        data: () => ({
            dialog: false,
            doneDialog: false,
            copyFromId: null,
            copyToId: null,
        }),
        computed: {
            explicitSaves: {
                get() {
                    let items = []

                    this.saves.forEach((save, index) => {
                        // セーブの最初の要素はテンポラリのため除外
                        if (index === 0) {
                            return
                        }

                        items.push({
                            id: index,
                            name: save.name,
                            value: save.value,
                        })
                    })

                    return items
                },
                set() {

                },
            },
            allSaves: {
                get() {
                    let items = []

                    this.saves.forEach((save, index) => {
                        let name = save.name

                        if (index === 0) {
                            if (!this.hasUrlParam) {
                                return
                            } else {
                                name = this.urlParamSaveName
                            }
                        }

                        items.push({
                            id: index,
                            name: name,
                            value: save.value,
                        })
                    })

                    return items
                },
                set() {

                },
            },
            canCopyOrReplace() {
                return (this.copyFromId !== null && this.copyToId !== null) &&
                    this.copyFromId !== this.copyToId
            },
            ...mapState('User', [
                'saves',
                'saveId',
                'hasUrlParam',
            ])
        },
        methods: {
            changeSaveName: debounce(function(newValue, index) {
                this.UPDATE_SAVE({
                    index: index,
                    save: {
                        name: newValue
                    }
                })
                this.$localStorage.set('saves', this.saves)
            }, 400),

            copySave() {
                const fromValue = this.allSaves.find(save => {
                    return save.id === this.copyFromId
                }).value

                this.UPDATE_SAVE({
                    index: this.copyToId,
                    save: {
                        value: fromValue
                    }
                })
                this.$localStorage.set('saves', this.saves)
                this.selectCharactersFromSave()

                this.doneDialog = true
            },

            replaceSave() {
                const fromValue = this.allSaves.find(save => {
                    return save.id === this.copyFromId
                }).value

                const toValue = this.allSaves.find(save => {
                    return save.id === this.copyToId
                }).value

                this.UPDATE_SAVE({
                    index: this.copyFromId,
                    save: {
                        value: toValue
                    }
                })

                this.UPDATE_SAVE({
                    index: this.copyToId,
                    save: {
                        value: fromValue
                    }
                })

                this.$localStorage.set('saves', this.saves)
                this.selectCharactersFromSave()

                this.doneDialog = true
            },

            selectCharactersFromSave() {
                const ids = this.saves[this.saveId].value
                if (ids) {
                    this.SET_SELECTED(util.inflateList(this.saves[this.saveId].value))
                } else {
                    this.SET_SELECTED([])
                }
            },

            ...mapMutations('User', [
                'UPDATE_SAVE',
                'SET_SELECTED',
            ]),
        },
    }
</script>

<style scoped>

</style>