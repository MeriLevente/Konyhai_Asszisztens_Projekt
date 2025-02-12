<script setup lang="ts">
    import type IType from '@/models/Type';
    import { useAdminStore } from '@/stores/adminstore';
    import { storeToRefs } from 'pinia';
    import { computed } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const { types } = storeToRefs(useAdminStore());
    const store = useAdminStore();

    const itemtypes = computed((): IType[] => {
        return store.storeTypes
    });

    const editType = (selected: IType) => {
        console.log(selected);
    };

    const deleteType = (selected: IType) => {
        console.log(selected);
    }
</script>

<template>
    <div class="container my-5 justify-center">
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_type')}}</h1>
        </div>
        <div class="row my-2">
            <div class="col-12">
                <table class="table" v-if="itemtypes.length > 0">
                <thead>
                    <tr>
                        <th>
                            <span class="btn btn-success">
                                {{ t("add_new") }}
                            </span>
                        </th>
                        <th class="text-center">Id</th>
                        <th class="text-center">{{ t("name") }} (hu)</th>
                        <th class="text-center">{{ t("name") }} (en)</th>
                        <th class="text-center">{{ t("image") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(type,index) in itemtypes" :key="index" :class="index % 2 == 0 ? 'grayTr' : ''">
                        <td>
                            <span class="btn btn-primary p-2 m-1"  v-on:click="editType(type)"><i class="bi bi-pencil"></i></span>
                            <span class="btn btn-danger p-2" v-on:click="deleteType(type)"><i class="bi bi-trash"></i></span>
                        </td>
                        <td class="text-center">{{ type.id }}</td>
                        <td class="text-center">{{ type.nameHU }}</td>
                        <td class="text-center">{{ type.nameEN }}</td>
                        <td class="text-center">{{ type.image }}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
    th{
        background-color: var(--ebony-clay);
        color: var(--mercury);
    }

    .grayTr{
        background-color: red;
    }
</style>