<script setup lang="ts">
    import TypeModal from '@/components/TypeModal.vue';
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
            nameHU: selected.nameHU,
            nameEN: selected.nameEN,
            image: selected.image
        }
    };

    const deleteType = (selected: IType) => {
        console.log(selected);
    };

    const saveData = (type: any) => {
        // storeban lévő saveType vagy edittype => serviceben
        console.log(type.value);
        data.value = null;
    };

    const closeModal = () => {
        data.value = null;
    }

</script>

<template>
    <div class="container my-5 justify-center">
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_type')}}</h1>
        </div>
        <div class="row my-2">
            
            <div class="col-12">
                <table class="table table-hover" v-if="itemtypes.length > 0">
                <thead>
                    <tr>
                        <th style="width: 10%;">
                            <span class="btn btn-success" v-on:click="addType">
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
                            <span class="btn btn-primary p-2 m-1"  v-on:click="editType(type)"><i class="bi bi-pencil"></i></span>
                            <span class="btn btn-danger p-2" v-on:click="deleteType(type)"><i class="bi bi-trash"></i></span>
                        </td>
                        <td class="text-center pt-3">{{ type.id }}</td>
                        <td class="text-center pt-3">{{ type.nameHU }}</td>
                        <td class="text-center pt-3">{{ type.nameEN }}</td>
                        <td><img class="tdImage" v-bind:src="type.image"></img></td>
                    </tr>
                </tbody>
            </table>
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
        border: var(--ebony-clay) 1px solid
    }

    .tdImage {
        width: 8vh;
        height: 5vh;
    }
</style>