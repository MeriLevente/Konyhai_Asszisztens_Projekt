<script setup lang="ts">
    import Paginator from '@/components/Paginator.vue';
    import Searchbar from '@/components/Searchbar.vue';
    import ItemModal from '@/components/modals/ItemModal.vue';
    import type Item from '@/models/Item';
    import { useAppStore } from '@/stores/appstore';
    import { useItemStore } from '@/stores/itemstore';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useItemStore();
    const {items} = storeToRefs(store);
    const searchInAction = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const maxLength = ref<number>(Number(sessionStorage.getItem("itemsMaxLength")) ?? store.items.length);
    const data = ref<Item | null>();

    onMounted((): void => {
        if (!sessionStorage.getItem("itemsMaxLength")) {
            useItemStore().getAllItemsLength().then((res: number): void => {
                maxLength.value = res;
            });
        };
    });

    const addItem = (): void => {
        data.value = {
            name: "",
            name_EN: "",
            typeId: 1,
            unit: "darab",
            image: ""
        };
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const editItem = (selected: Item): void => {
        data.value = {
            id: selected.id,
            name: selected.name,
            name_EN: selected.name_EN,
            typeId: selected.typeId,
            unit: selected.unit,
            image: selected.image
        };
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const deleteItem = (selected: Item): void => {
        if (confirm(`${t("deleteYesNo")} ${useAppStore().appLanguage == "hu" ? selected.name : selected.name_EN}?`) == true)
            store.deleteItem(selected)
                .catch((err: string): void => {
                    alert(err);
                });
    };

    const saveData = (item: any): void => {
        store.saveItem(item.value)!
            .then((): void => closeModal())
            .catch(()=> {});
    };

    const closeModal = (): void => {
        useItemStore().itemsError.hu = "";
        useItemStore().itemsError.hu = "";
        data.value = null;
        document.getElementsByTagName('body')[0].classList.remove('disable-scrolling');
    };

    const search = (searchedWord: string): void => {
        loading.value = true;
        store.searchItems(searchedWord)
            .then((): void => {
                searchInAction.value = true;
                loading.value = false;
            })
            .catch((err: string): void => {
                alert(err);
                loading.value = false;
            });
    };

    const loadItemsPaginated = (data: {from: number, to: number}): void => {
        loading.value = true;
        store.loadItemsPaginated(data.from, data.to)
            .then((): void => {
                loading.value = false;
            })
            .catch((err: string): void => {
                console.error(err); 
                loading.value = false
            });
    };
</script>

<template>
    <main class="container my-5">
        <div class="row">
            <RouterLink class="back-to-admin" to="/admin" data-cy="back-button">Admin >> {{ t('edit_items') }}</RouterLink>
        </div>
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_items')}}</h1>
        </div>
        <div class="row d-flex justify-content-center">
            <Searchbar v-on:search="search" v-on:show-paginated="loadItemsPaginated({from: 0, to: 6}); searchInAction = false;" 
                class="w-50" :viewer-role="'admin'" :searchInAction="searchInAction"/>
        </div>
        <div class="row my-5 d-flex justify-content-center" v-if="loading">
            <span class="spinner-border spinner-border-bg text-center"></span>
        </div>
        <div class="row my-2" v-if="!loading">
            <div class="col-12">
                <ItemModal :data="data" v-if="data" v-on:save-data="saveData" v-on:close-modal="closeModal"/>
                
                <div v-if="store.items.length == 0" class="nodata-div w-50 mx-auto p-3">
                    <h3 class="text-center" data-cy="no-data">{{ t("no_data") }}</h3>
                </div>

                <div class="table-responsive">
                    <table class="admin-table" v-if="store.items.length > 0">
                        <thead>
                            <tr>
                                <th style="width: 10%;">
                                    <span class="btn btn-success m-1" v-on:click="addItem" data-cy="add-button">
                                        {{ t("add_new") }}
                                    </span>
                                </th>
                                <th class="text-center" style="width: 1%;">Id</th>
                                <th class="text-center" style="width: 10%;">{{ t("name") }} (hu)</th>
                                <th class="text-center" style="width: 10%;">{{ t("name") }} (en)</th>
                                <th class="text-center" style="width: 8%;">{{ t("type")}} id</th>
                                <th style="width: 6%;">{{ t("image") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in items" :key="index" data-cy="data-tr">
                                <td>
                                    <span class="btn btn-primary table-btn p-2 m-1"  v-on:click="editItem(item)" data-cy="edit-button">
                                        <i class="bi bi-pencil d-flex justify-content-center"></i>
                                    </span>
                                    <span class="btn btn-danger table-btn p-2" v-on:click="deleteItem(item)" data-cy="delete-button">
                                        <i class="bi bi-trash d-flex justify-content-center"></i>
                                    </span>
                                </td>
                                <td class="text-center pt-3">{{ item.id }}</td>
                                <td class="text-center pt-3">{{ item.name }}</td>
                                <td class="text-center pt-3">{{ item.name_EN }}</td>
                                <td class="text-center pt-3">{{ item.typeId }}</td>
                                <td><img class="td-image" v-bind:src="item.image" alt="Img"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <Paginator v-if="!searchInAction" :max-length="store.itemsAllLength" 
            v-on:paginator-triggered="loadItemsPaginated" :page="'admin_items'"/>
    </main>
</template>

<style lang="css"/>