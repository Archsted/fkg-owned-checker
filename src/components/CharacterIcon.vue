<template>
    <div class="character-icon-wrapper">
        <div
            :class="[`character-icon`, `character-icon-${charaData.id}`, characterIconClass]"
            @click="toggleSelected(charaData.id)"
            v-tooltip.bottom="charaData.name"
        ></div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'

    export default {
        props: {
            charaData: {
                type: Object,
                required: true,
            },
            active: {
                type: Boolean,
                required: true,
            },
        },
        computed: {
            characterIconClass() {
                return {
                    'character-icon-active': this.active,
                    'character-icon-inactive': !this.active,
                }
            },
        },
        methods: {
            toggleSelected(id) {
                if (this.active) {
                    this.REMOVE_SELECTED(id)
                } else {
                    this.ADD_SELECTED(id)
                }

//                this.replaceHistoryState()
            },
            ...mapMutations('User', [
                'ADD_SELECTED',
                'REMOVE_SELECTED',
            ]),
        },
    }
</script>

<style scoped>
    .character-icon-wrapper {
        padding: 0;
        margin: 1px;
        background-color: #000000;
    }

    .character-icon {
        margin: 0;
        padding: 0;
        vertical-align: middle;
        cursor: pointer;

        width: 70px;
        height: 70px;
    }

    .character-icon-active {
        opacity: 1;
    }

    .character-icon-inactive {
        opacity: .6;
        filter: grayscale(100%);
    }

    .character-icon-inactive:hover {
        opacity: 1;
    }
</style>