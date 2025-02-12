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
        console.log(store.storeTypes)
        return store.storeTypes
    });
</script>

<template>
    <div class="container my-5 justify-center">
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_type')}}</h1>
        </div>
        <div class="row my-2">
            <table class="table">
                <thead>
                    <tr>
                        <th class="text-center">Id</th>
                        <th class="text-center">{{ t("name") }} (hu)</th>
                        <th class="text-center">{{ t("name") }} (en)</th>
                        <th class="text-center">{{ t("image") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(type,index) in itemtypes" :key="index" :class="index % 2 == 0 ? 'grayTr' : ''">
                        <td>{{ type.id }}</td>
                        <td>{{ type.nameHU }}</td>
                        <td>{{ type.nameEN }}</td>
                        <td>{{ type.image }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="css" scoped>
    th{
        background-color: var(--ebony-clay);
        color: var(--mercury);
    }

    .grayTr{
        background-color: var(--oslo-gray);
    }
</style>