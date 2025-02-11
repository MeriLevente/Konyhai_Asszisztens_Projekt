<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();

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
                    <!-- <tr v-for="(type,index) in itemtypes">
                        <td :class="index % 2 == 0 ? 'grayTd' : ''">{{ type.id }}</td>
                        <td :class="index % 2 == 0 ? 'grayTd' : ''">{{ type.nameHU }}</td>
                        <td :class="index % 2 == 0 ? 'grayTd' : ''">{{ type.nameEN }}</td>
                        <td :class="index % 2 == 0 ? 'grayTd' : ''">{{ type.image }}</td>
                    </tr> -->
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

    .grayTd{
        background-color: var(--oslo-gray);
    }
</style>