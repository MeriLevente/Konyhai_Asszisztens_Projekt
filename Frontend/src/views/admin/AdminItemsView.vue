<script setup lang="ts">
    import ItemModal from '@/components/modals/ItemModal.vue';
    import type Item from '@/models/Item';
    import { useAdminStore } from '@/stores/adminstore';
    import DataLoader from '@/utils/DataLoader';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useAdminStore();

    DataLoader.loadItems();

    let data = ref<Item | null>();

    const addItem = () => {
        data.value = {
            name: "",
            name_EN: "",
            typeId: 1,
            unit: "darab",
            image: ""
        };
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const editItem = (selected: Item) => {
        data.value = {
            itemId: selected.itemId,
            name: selected.name,
            name_EN: selected.name_EN,
            typeId: selected.typeId,
            unit: selected.unit,
            image: selected.image
        }
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const deleteItem = (selected: Item) => {
        store.deleteItem(selected).then(()=> closeModal()).catch();
    };

    const saveData = (item: any) => {
        store.saveItem(item.value)?.then(()=> closeModal()).catch();
    };

    const closeModal = () => {
        store.items_error.hu = "";
        store.items_error.en = "";
        data.value = null;
        document.getElementsByTagName('body')[0].classList.remove('disable-scrolling')
    };
</script>

<template>
    <div class="container my-5 justify-center" style="font-family: Funnel Sans, sans-serif;">
        <div class="row">
            <RouterLink class="back-to-admin" to="/admin">Admin >> {{ t('edit_items') }}</RouterLink>
        </div>
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_items')}}</h1>
        </div>
        <div class="row my-2">
            <div class="col-12">
                <ItemModal :data="data" v-if="data" v-on:save-data="saveData" v-on:close-modal="closeModal"/>
                <div v-if="useAdminStore().items.length == 0" class="d-flex justify-content-center">
                    <p style="font-weight: bold;color: red;">{{ t("no_data") }}</p>
                </div>
                <div class="d-flex justify-content-center">
                    <span v-if="useAdminStore().items.length == 0" class="btn btn-success" v-on:click="addItem">
                        {{ t("add_new") }}
                    </span>
                </div>
                <div class="table-responsive">
                    <table class="admin-table" v-if="useAdminStore().items.length > 0">
                    <thead>
                        <tr>
                            <th style="width: 10%;">
                                <span class="btn btn-success m-1" v-on:click="addItem">
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
                        <tr v-for="(item,index) in useAdminStore().items" :key="index">
                            <td>
                                <span class="btn btn-primary table-btn p-2 m-1"  v-on:click="editItem(item)">
                                    <i class="bi bi-pencil d-flex justify-content-center"></i>
                                </span>
                                <span class="btn btn-danger table-btn p-2" v-on:click="deleteItem(item)">
                                    <i class="bi bi-trash d-flex justify-content-center"></i>
                                </span>
                            </td>
                            <td class="text-center pt-3">{{ item.itemId }}</td>
                            <td class="text-center pt-3">{{ item.name }}</td>
                            <td class="text-center pt-3">{{ item.name_EN }}</td>
                            <td class="text-center pt-3">{{ item.typeId }}</td>
                            <td><img class="tdImage" v-bind:src="item.image" alt="Img"></td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css">

</style>