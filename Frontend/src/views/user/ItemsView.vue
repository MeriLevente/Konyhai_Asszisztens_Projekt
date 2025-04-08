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
    const { storedItems, showAllTrig, searchStorageInAction, storedItemsAllLength, storageLoading } = storeToRefs(useUserStore());
    const { loadingTypes } = storeToRefs(useTypeStore());
    const { t } = useI18n();
    const selectedType = ref<number | null>(null);
    const popupType = ref<string | null>();
    const quantityMethod = ref<string | null>();
    const modifyItem = ref<StoredItem | undefined>();
    
    onMounted((): void => {
        DataLoader.loadTypes();
        useItemStore().getAllItemsLength();
        useUserStore().getStorageLength();
    });

    const loadItemsPaginated = (data: {from: number, to: number}): void => {
        storageLoading.value = true;
        useUserStore().loadStoredItemsPaginated(data.from, data.to)
            .then((): void => {
                storageLoading.value = false;
            })
            .catch((err: string): void =>{
                storageLoading.value = false;
                console.error(err);
            });
    };

    const search = (searchedWord: string): void => { 
        useUserStore().getStoredItemsBySearch(selectedType.value, searchedWord)!
            .then((): void => {
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
        searchStorageInAction.value = false;
        showAllTrig.value = !showAllTrig.value;
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
    <main class="container p-3">
        <div class="background" v-if="popupType"></div>
        <UserSidePopup style="position: fixed; display: block; z-index: 1;" 
            v-if="popupType" :popuptype="popupType" :quantitymethod="quantityMethod" :modified-item="modifyItem" v-on:close="closePopUp"/>
        <UserSideHeader :header-title="'mykitchen'" :header-description="'titleCatchphrase'"
                        v-on:show-all="showAllItems" v-on:search-stored-item="search" v-on:show-new="showNew"/>
        <div class="row d-flex justify-content-center mt-2" v-if="showAllTrig && !searchStorageInAction">
            <Paginator :page="'mykitchen'" 
                :max-length="storedItemsAllLength" v-on:paginator-triggered="loadItemsPaginated"/>
        </div>
        <main v-if="!storageLoading && !loadingTypes" id="storedItemsList" class="row d-flex justify-content-center">
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
        <div class="d-flex justify-content-center mt-5" v-if="storageLoading || loadingTypes">
            <span class="spinner-border spinner-border-bg text-center"></span>
        </div>
    </main>
</template>

<style lang="css" src="@/assets/css/userside.css"/>