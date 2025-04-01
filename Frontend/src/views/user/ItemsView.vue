<script setup lang="ts">
    import ItemTypesCard from '@/components/mykitchen/ItemTypesCard.vue';
    import StoredItemCard from '@/components/mykitchen/StoredItemCard.vue';
    import UserSidePopup from '@/components/mykitchen/UserSidePopup.vue';
    import UserSideHeader from '@/components/UserSideHeader.vue';
    import type StoredItem from '@/models/StoredItem';
    import { useTypeStore } from '@/stores/typestore';
    import { useUserStore } from '@/stores/userstore';
    import DataLoader from '@/utils/DataLoader';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    let selectedType = ref<number | null>(null);
    let showAlltriggered = ref<boolean>(false);
    let popupType = ref<string | null>();
    let quantityMethod = ref<string | null>();
    let modifyItem = ref<StoredItem | undefined>();

    DataLoader.loadTypes();

    const search = (searchedWord: string): void => { 
        useUserStore().getStoredItemsBySearch(selectedType.value, searchedWord)?.then(()=>{
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

    const showQuantityPopup = (method: string, modifiedItem: StoredItem): void => {
        popupType.value = "quantity";
        quantityMethod.value = method;
        modifyItem.value = modifiedItem;
    };

    const showNew = (): void => {
        popupType.value = "new";
    };

    const closePopUp = (): void => {
        popupType.value = null;
    };
</script>

<template>
    <div class="container p-3">
        <UserSidePopup v-if="popupType" :popuptype="popupType" :quantitymethod="quantityMethod" :modified-item="modifyItem" v-on:close="closePopUp"/>
        <UserSideHeader v-if="!popupType" :header-title="'mykitchen'" :header-description="'titleCatchphrase'" 
                        v-on:show-all="showAllItems" v-on:search-stored-item="search" v-on:show-new="showNew"/>
        <main v-if="!popupType" id="storedItemsList" class="row d-flex justify-content-center mt-2">
            <ItemTypesCard v-for="type in useTypeStore().types" :type="type" v-on:type-clicked="typeClicked($event)"
                v-if="!selectedType && !showAlltriggered"/>

            <span v-if="selectedType || showAlltriggered" v-on:click="selectedType = null; showAlltriggered = false">
                <i class="bi bi-arrow-left" style="font-weight: bold; font-size: 1.5rem; cursor: pointer;"></i>
            </span>

            <div class="col-12 col-sm-6 col-md-5 col-xl-3 mb-1" v-for="item in useUserStore().storedItems" v-if="selectedType || showAlltriggered">
                <StoredItemCard :item="item" data-cy="stored-item" v-on:showpopup="showQuantityPopup"/>
            </div>

            <div v-if="useUserStore().storedItems.length == 0 && (selectedType || showAlltriggered)" class="d-flex row justify-content-center">
                <img class="no-items" src="@/assets/images/poorfridge.png" alt="Image not loaded!">
                <h3 class="text-center" v-on:load="showAlltriggered = false">{{ t("noitems") }}</h3>
            </div>
        </main>
    </div>
</template>

<style lang="css" src="@/assets/css/userside.css">
    
</style>