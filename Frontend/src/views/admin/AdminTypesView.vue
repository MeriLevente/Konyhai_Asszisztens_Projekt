<script setup lang="ts">
    import TypeModal from '@/components/modals/TypeModal.vue';
    import type IType from '@/models/Type';
    import { useAdminStore } from '@/stores/adminstore';
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useAdminStore();

    const itemtypes = computed((): IType[] => {
        return store.storeTypes
    });

    let data = ref<IType | null>();

    const addType = () => {
        data.value = {
            nameHU: "",
            nameEN: "",
            image: ""
        }
    };

    const editType = (selected: IType) => {
        data.value = {
            id: selected.id,
            nameHU: selected.nameHU,
            nameEN: selected.nameEN,
            image: selected.image
        }
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
    }

</script>

<template>
    <div class="background" v-if="data"></div>
    <div class="container my-5 justify-center">
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_type')}}</h1>
        </div>
        <div class="row my-2">  
            <div class="col-12">
                <div v-if="itemtypes.length == 0" class="d-flex justify-content-center">
                    <p style="font-weight: bold;color: red;">{{ t("no_data") }}</p>
                </div>
                <div class="d-flex justify-content-center">
                    <span v-if="itemtypes.length == 0" class="btn btn-success" v-on:click="addType">
                        {{ t("add_new") }}
                    </span>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover" v-if="itemtypes.length > 0">
                    <thead>
                    <tr>
                        <th style="width: 10%;">
                            <span class="btn btn-success btn-add pt-0" v-on:click="addType">
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
                    <tr v-for="(type,index) in itemtypes" :key="index">
                        <td>
                            <span class="btn btn-primary p-2 m-1 table-btn"  v-on:click="editType(type)"><i class="bi bi-pencil d-flex justify-content-center"></i></span>
                            <span class="btn btn-danger p-2 table-btn" v-on:click="deleteType(type)"><i class="bi bi-trash d-flex justify-content-center"></i></span>
                        </td>
                        <td class="text-center pt-3">{{ type.id }}</td>
                        <td class="text-center pt-3">{{ type.nameHU }}</td>
                        <td class="text-center pt-3">{{ type.nameEN }}</td>
                        <!-- <td><img class="tdImage" v-bind:src="type.image"></img></td> -->
                        <td><img class="tdImage" :src="type.image" alt="image"></td>
                    </tr>
                    </tbody>
                    </table>
                </div>
            <TypeModal :data="data" v-if="data" v-on:save-data="saveData" v-on:close-modal="closeModal"/>
            
            </div>
        </div>
    </div>
</template>

<style lang="css">
    th{
        background-color: var(--ebony-clay);
        color: var(--mercury);
    }

    table {
        border: var(--ebony-clay) 1px solid;
        font-size: 2vh;
    }

    .tdImage {
        width: 6vh;
        height: 5vh;
    }

    .background {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
        background-color: black;
        opacity: 0.8;
        z-index: 0;
    }

    .table-btn {
        width: 3.5vh;
        height: 3.5vh;
    }

    .btn-add {
        width: 10vh;
        height: 3.5vh; 
    }

    i {
        font-size: 1.6vh;
    }
</style>