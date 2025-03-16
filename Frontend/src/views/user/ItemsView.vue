<script setup lang="ts">
    import StoredItemCard from '@/components/StoredItemCard.vue';
import { useUserStore } from '@/stores/userstore';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const searchedWord = ref<string>();
    const allCB = ref();

    useUserStore().getStoredItems().then(()=>{});
    const search = () => {
        console.log(searchedWord.value)
    };
</script>

<template>
    <div class="container p-3">
        <div class="row items-header-div p-1">
            <h1 class="text-center mt-3 display-4 mb-0">{{t("mykitchen")}}</h1>
            <p class="text-center mt-0">{{ t("manageitems") }}</p>
            <div class="row">
                <div class="col-6 col-md-3 d-flex justify-content-center">
                    <button class="btn w-100 h-50" id="newItemBtn"><span style="font-size: 1.2rem;">{{ t("add_new") }}</span></button>
                </div>
                <div class="col-6 col-md-3 pt-4">
                    <input type="checkbox" v-model="allCB" class="ms-1 mt-2" style="float: right;">
                    <label style="font-size: 1.2rem; float: right;">{{ t("showAll") }}</label>
                    
                </div>
                <div class="col-12 col-md-6">
                    <form @submit.prevent="search()">
                        <div class="form-floating" style="border: 2px solid var(--ebony-clay); border-radius: 10px;">
                            <input type="text" name="search" id="search" class="form-control" v-model="searchedWord">
                                <button type="submit" class="search-icon" style="display: inline;">
                                    <span class="bi bi-search"></span>
                                </button>
                            </input>
                            <label for="search">{{ t("search") }}</label>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
        <div id="storedItemsList" class="row d-flex justify-content-center mt-2">
            <div class="col-5 col-md-3 mb-1" v-for="item in useUserStore().storedItems">
                <StoredItemCard :item="item" data-cy="stored-item"/>
            </div>
        </div>
    </div>
</template>

<style lang="css">
    .items-header-div{
        border: 2px solid var(--ebony-clay);
        border-radius: 21px;
        background-color: var(--barley);
        font-weight: bold;
        color: white;
    }

    .search-icon{
        display: inline;
        margin-left: 10%;
        position: relative;
        border: 0;
        background-color: white;
        cursor: pointer;
        float: right;
        transform: translateY(-120%);
        font-size: 1.4rem;
    }

    #newItemBtn{
        background-color: var(--ebony-clay);
        color: white;
        transform: translateY(25%);
    }
</style>