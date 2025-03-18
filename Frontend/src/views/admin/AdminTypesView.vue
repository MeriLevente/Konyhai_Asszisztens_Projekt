<script setup lang="ts">
    import TypeModal from '@/components/modals/TypeModal.vue';
    import type IType from '@/models/Type';
    import { useAdminStore } from '@/stores/adminstore';
    import DataLoader from '@/utils/DataLoader';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useAdminStore();

    DataLoader.loadTypes();

    let data = ref<IType | null>();

    const addType = () => {
        data.value = {
            name_HU: "",
            name_EN: "",
            image: ""
        };
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const editType = (selected: IType) => {
        data.value = {
            id: selected.id,
            name_HU: selected.name_HU,
            name_EN: selected.name_EN,
            image: selected.image
        }
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const deleteType = (selected: IType) => {
        store.deleteType(selected)?.then().catch();
    };

    const saveData = (type: any) => {
        store.saveType(type.value)?.then(()=>{
            closeModal();          
        }).catch()
    };

    const closeModal = () => {
        store.type_error.hu = "";
        store.type_error.en = "";
        data.value = null;
        document.getElementsByTagName('body')[0].classList.remove('disable-scrolling')
    }

</script>

<template>
    <div class="background" v-if="data"></div>
    <div class="container my-5 justify-center" style="font-family: Funnel Sans, sans-serif;">
        <div class="row">
            <RouterLink class="back-to-admin" to="/admin">Admin >> {{ t('edit_type') }}</RouterLink>
        </div>
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_type')}}</h1>
        </div>
        <div class="row my-2">  
            <div class="col-12">
                <TypeModal :data="data" v-if="data" v-on:save-data="saveData" v-on:close-modal="closeModal"/>
                <div v-if="store.types.length == 0" class="d-flex justify-content-center">
                    <p style="font-weight: bold;color: red;">{{ t("no_data") }}</p>
                </div>
                <div class="d-flex justify-content-center">
                    <span v-if="store.types.length == 0" class="btn btn-success" v-on:click="addType">
                        {{ t("add_new") }}
                    </span>
                </div>
                <div class="table-responsive">
                    <table class="admin-table" v-if="store.types.length > 0">
                    <thead>
                    <tr>
                        <th style="width: 10%;">
                            <span class="btn btn-success m-1" v-on:click="addType">
                                {{ t("add_new") }}
                            </span>
                        </th>
                        <th class="text-center" style="width: 1%;">Id</th>
                        <th class="text-center" style="width: 20%;">{{ t("name") }} (hu)</th>
                        <th class="text-center" style="width: 25%;">{{ t("name") }} (en)</th>
                        <th style="width: 20%;">{{ t("image") }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(type,index) in store.types" :key="index">
                        <td>
                            <span class="btn btn-primary p-2 m-1 table-btn"  v-on:click="editType(type)"><i class="bi bi-pencil d-flex justify-content-center"></i></span>
                            <span class="btn btn-danger p-2 table-btn" v-on:click="deleteType(type)"><i class="bi bi-trash d-flex justify-content-center"></i></span>
                        </td>
                        <td class="text-center pt-3">{{ type.id }}</td>
                        <td class="text-center pt-3">{{ type.name_HU }}</td>
                        <td class="text-center pt-3">{{ type.name_EN }}</td>
                        <td><img class="tdImage" :src="type.image" alt="image"></td>
                    </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" src="@/assets/css/admin.css">
    
</style>