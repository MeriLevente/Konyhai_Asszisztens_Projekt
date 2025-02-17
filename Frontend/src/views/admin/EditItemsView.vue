<script setup lang="ts">
    import ItemModal from '@/components/modals/ItemModal.vue';
    import type Item from '@/models/Item';
    import type IType from '@/models/Type';
    import { useAdminStore } from '@/stores/adminstore';
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useAdminStore();

    const items = computed((): Item[] => {
        return store.storeItems
    });

    let data = ref<Item | null>();

    const addItem = () => {
        data.value = {
            nameHU: "",
            nameEN: "",
            typeId: 1,
            unit: "darab",
            image: ""
        }
    };

    const editItem = (selected: Item) => {
        data.value = {
            nameHU: selected.nameHU,
            nameEN: selected.nameEN,
            typeId: selected.typeId,
            unit: selected.unit,
            image: selected.image
        }
    };

    const deleteItem = (selected: Item) => {
        console.log(selected);
    };

    const saveData = (type: any) => {
        // storeban lévő saveItem vagy editItem => serviceben
        console.log(type.value);
        data.value = null;
    };

    const closeModal = () => {
        data.value = null;
    };

    const getTypeById = (typeId: number): {} => {
        const type: IType = store.storeTypes.filter(x=> x.id == typeId)[0];
        return {hu: type.nameHU, en: type.nameEN} 
    };
</script>

<template>
    <div class="container my-5 justify-center">
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_items')}}</h1>
        </div>
        <div class="row my-2">
            
            <div class="col-12">
                <div v-if="items.length == 0" class="d-flex justify-content-center">
                    <p style="font-weight: bold;color: red;">{{ t("no_data") }}</p>
                </div>
                <div class="d-flex justify-content-center">
                    <span v-if="items.length == 0" class="btn btn-success" v-on:click="addItem">
                        {{ t("add_new") }}
                    </span>
                </div>
                <table class="table table-hover" v-if="items.length > 0">
                <thead>
                    <tr>
                        <th style="width: 10%;">
                            <span class="btn btn-success" v-on:click="addItem">
                                {{ t("add_new") }}
                            </span>
                        </th>
                        <th class="text-center" style="width: 1%;">Id</th>
                        <th class="text-center" style="width: 15%;">{{ t("name") }} (hu)</th>
                        <th class="text-center" style="width: 15%;">{{ t("name") }} (en)</th>
                        <th class="text-center" style="width: 10%;">{{ t("type")}} (hu)</th>
                        <th class="text-center" style="width: 10%;">{{ t("type") }} (en)</th>
                        <th class="text-center" style="width: 5%;">{{ t("unit") }}</th>
                        <th style="width: 10%;">{{ t("image") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in items" :key="index">
                        <td>
                            <span class="btn btn-primary p-2 m-1"  v-on:click="editItem(item)"><i class="bi bi-pencil"></i></span>
                            <span class="btn btn-danger p-2" v-on:click="deleteItem(item)"><i class="bi bi-trash"></i></span>
                        </td>
                        <td class="text-center pt-3">{{ item.id }}</td>
                        <td class="text-center pt-3">{{ item.nameHU }}</td>
                        <td class="text-center pt-3">{{ item.nameEN }}</td>
                        <td class="text-center pt-3" v-for="type in getTypeById(item.typeId)">{{ type }}</td>
                        <td class="text-center pt-3">{{ item.unit }}</td>
                        <td><img class="tdImage" v-bind:src="item.image" alt="Img"></td>
                    </tr>
                </tbody>
            </table>
            <ItemModal :data="data" v-if="data" v-on:save-data="saveData" v-on:close-modal="closeModal"/>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
     th{
        background-color: var(--ebony-clay);
        color: var(--mercury);
    }

    table {
        border: var(--ebony-clay) 1px solid
    }

    .tdImage {
        width: 8vh;
        height: 5vh;
    }
</style>