<script setup lang="ts">
    import ItemTypesCard from '@/components/mykitchen/ItemTypesCard.vue';
    import StoredItemCard from '@/components/mykitchen/StoredItemCard.vue';
    import UserSidePopup from '@/components/mykitchen/UserSidePopup.vue';
    import Paginator from '@/components/Paginator.vue';
    import UserSideHeader from '@/components/UserSideHeader.vue';
    import type StoredItem from '@/models/StoredItem';
    import { useItemStore } from '@/stores/itemstore';
    import { useTypeStore } from '@/stores/typestore';
    import { useUserStore } from '@/stores/userstore';
    import DataLoader from '@/utils/DataLoader';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { storedItems, showAllTrig, searchStorageInAction, storedItemsAllLength } = storeToRefs(useUserStore());
    const { t } = useI18n();
    let selectedType = ref<number | null>(null);
    
    let popupType = ref<string | null>();
    let quantityMethod = ref<string | null>();
    let modifyItem = ref<StoredItem | undefined>();
    
    onMounted(()=> {
        DataLoader.loadTypes();
        useItemStore().getAllItemsLength();
        useUserStore().getStorageLength();
    })

    const loadItemsPaginated = (data: {from: number, to: number}) => {
        useUserStore().loadStoredItemsPaginated(data.from, data.to).catch((err: string)=>{console.error(err)});
    };

    const search = (searchedWord: string): void => { 
        useUserStore().getStoredItemsBySearch(selectedType.value, searchedWord)?.then(()=>{
            showAllTrig.value = true;
        });
    };

    const typeClicked = (id: number): void => {
        selectedType.value = id;
        showAllTrig.value = false;
        useUserStore().getStoredItemsByTypeId(selectedType.value);
        useUserStore().selectedItemtype = id;
    };

    const showAllItems = (): void => {
        showAllTrig.value = !showAllTrig.value;
        loadItemsPaginated({from: 0, to: 6});
    };

    const showQuantityPopup = (method: string, modifiedItem: StoredItem): void => {
        popupType.value = "quantity";
        quantityMethod.value = method;
        modifyItem.value = modifiedItem;
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const showNew = (): void => {
        popupType.value = "new";
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const closePopUp = (): void => {
        popupType.value = null;
        document.getElementsByTagName('body')[0].classList.remove('disable-scrolling');
    };

    const backToTypes = (): void => {
        selectedType.value = null; 
        showAllTrig.value = false;
        searchStorageInAction.value = false;
    };
</script>

<template>
    <div class="container p-3">
        <div class="background" v-if="popupType"></div>
        <UserSidePopup style="position: fixed; display: block; z-index: 1;" 
            v-if="popupType" :popuptype="popupType" :quantitymethod="quantityMethod" :modified-item="modifyItem" v-on:close="closePopUp"/>
        <UserSideHeader :header-title="'mykitchen'" :header-description="'titleCatchphrase'"
                        v-on:show-all="showAllItems" v-on:search-stored-item="search" v-on:show-new="showNew"/>
        <main id="storedItemsList" class="row d-flex justify-content-center mt-2">
            <Paginator v-if="showAllTrig && !searchStorageInAction" :page="'mykitchen'" 
                :max-length="storedItemsAllLength" v-on:paginator-triggered="loadItemsPaginated"/>
            <ItemTypesCard v-for="type in useTypeStore().types" :type="type" v-on:type-clicked="typeClicked($event)"
                v-if="!selectedType && !showAllTrig"/>

            <span v-if="selectedType || showAllTrig" v-on:click="backToTypes">
                <i class="bi bi-arrow-left" style="font-weight: bold; font-size: 1.5rem; cursor: pointer;"></i>
            </span>

            <div class="col-12 col-sm-6 col-md-4 col-xl-4 mb-1" v-for="item in storedItems" v-if="selectedType || showAllTrig">
                <StoredItemCard :item="item" data-cy="stored-item" v-on:showpopup="showQuantityPopup"/>
            </div>

            <div v-if="storedItems.length == 0 && (selectedType || showAllTrig)" class="d-flex row justify-content-center">
                <img class="no-items" src="@/assets/images/poorfridge.png" alt="Image not loaded!">
                <h3 class="text-center" v-on:load="showAllTrig = false">{{ t("noitems") }}</h3>
            </div>
        </main>
    </div>
</template>

<style lang="css" src="@/assets/css/userside.css">
    
</style>