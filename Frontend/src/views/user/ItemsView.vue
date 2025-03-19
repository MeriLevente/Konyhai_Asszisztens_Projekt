<script setup lang="ts">
    import ItemTypesCard from '@/components/ItemTypesCard.vue';
    import StoredItemCard from '@/components/StoredItemCard.vue';
    import { useAdminStore } from '@/stores/adminstore';
    import { useUserStore } from '@/stores/userstore';
    import DataLoader from '@/utils/DataLoader';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const searchedWord = ref<string>();
    const allCB = ref();
    let selectedType = ref<number | null>(null);
    let showAlltriggered = ref<boolean>(false);

    DataLoader.loadTypes();

    const search = (): void => { 
        useUserStore().getStoredItemsBySearch(selectedType.value, searchedWord.value)?.then(()=>{
            showAlltriggered.value = true;
        });
    };

    const typeClicked = (id: number): void => {
        selectedType.value = id;
        showAlltriggered.value = false;
        useUserStore().getStoredItemsByTypeId(selectedType.value);
    };

    const showAllItems = (): void => {
        showAlltriggered.value = !showAlltriggered.value;
        useUserStore().getStoredItems();
    };
</script>

<template>
    <div class="container p-3">
        <header class="row items-header-div p-1">
            <h1 class="text-center mt-3 display-4 mb-0 items-h1">{{t("mykitchen")}}</h1>
            <p class="text-center mt-0 p-catchphrase">{{ t("titleCatchphrase") }}</p>
            <div class="row filtering">
                <div class="col-6 col-md-3 d-flex justify-content-center">
                    <button class="btn w-100" id="newItemBtn"><span style="font-size: 1.2rem;">{{ t("add_new") }}</span></button>
                </div>
                <div class="col-6 col-md-3 pt-4">
                    <input type="checkbox" v-model="allCB" class="ms-1 mt-2" style="float: right;" v-on:change="showAllItems()" :checked="showAlltriggered">
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
        </header>
        <main id="storedItemsList" class="row d-flex justify-content-center mt-2">
            <ItemTypesCard v-for="type in useAdminStore().types" :type="type" v-on:type-clicked="typeClicked($event)"
                v-if="!selectedType && !showAlltriggered"/>

            <span v-if="selectedType || showAlltriggered" v-on:click="selectedType = null; showAlltriggered = false">
                <i class="bi bi-arrow-left" style="font-weight: bold; font-size: 1.5rem; cursor: pointer;"></i>
            </span>

            <div class="col-12 col-sm-6 col-md-5 col-xl-3 mb-1" v-for="item in useUserStore().storedItems" v-if="selectedType || showAlltriggered">
                <StoredItemCard :item="item" data-cy="stored-item"/>
            </div>

            <div v-if="useUserStore().storedItems.length == 0 && (selectedType || showAlltriggered)" class="d-flex row justify-content-center">
                <img class="no-items" src="@/assets/images/poorfridge.png" alt="Image not loaded!">
                <h3 class="text-center" v-on:load="showAlltriggered = false">{{ t("noitems") }}</h3>
            </div>
        </main>
    </div>
</template>

<style lang="css">
    .items-header-div {
        border: 2px solid var(--ebony-clay);
        border-radius: 21px;
        background-color: var(--barley);
        font-weight: bold;
        color: white;
        height: 14rem;
    }

    .search-icon {
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

    #newItemBtn {
        background-color: var(--ebony-clay);
        color: white;
        transform: translateY(30%);
        height: 2.4rem;
    }

    .p-catchphrase {
        font-size: 2rem;
        color: var(--ebony-clay);
        font-weight: bold;
    }

    .no-items {
        width: 20rem;
        height: 20rem;
    }

    @media only screen and (max-width: 770px) {
        .p-catchphrase {
            font-size: 1.3rem;
        }
        .items-h1 {
            font-size: 1.8rem;
        }
        .filtering {
            transform: translateY(-15%);
        }
    }
</style>