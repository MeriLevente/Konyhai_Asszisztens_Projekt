<script setup lang="ts">
    import type Item from '../../models/Item';
    import { useAdminStore } from '../../stores/adminstore';
    import { useAppStore } from '../../stores/appstore'
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { items_error, types, units } = storeToRefs(useAdminStore());
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["data"]);
    const emit = defineEmits(["saveData", "closeModal"])

    const closeModal = () => {
        emit('closeModal')
    }

    const saveChanges = () => {
        emit('saveData', modalData)
    }

    let modalData = ref<Item>({
        nameHU: props.data.nameHU,
        nameEN: props.data.nameEN,
        unit: props.data.unit,
        typeId: props.data.typeId,
        image: props.data.image
    });

</script>

<template>
   <div class="modal" tabindex="-1" style="display: block;" v-if="data">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ t("edit_items") }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" v-on:click="closeModal"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="saveChanges()">
                    <div class="mb-3">
                        <label for="nameHU" class="form-label">{{ t("name") }} (hu)</label>
                        <input type="text" class="form-control" id="nameHU" v-model="modalData.nameHU" required>
                    </div>
                    <div class="mb-3">
                        <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                        <input type="text" class="form-control" id="nameEN" v-model="modalData.nameEN" required>
                    </div>
                    <div class="mb-3">
                        <label for="types" class="form-label">{{ t("type") }}</label>
                        <select name="type" id="types" required v-model="modalData.typeId" class="form-control">
                            <option v-for="(type,index) in types" :value="type.id" :selected="index+1 == modalData.typeId">{{ app_language.lang == 'hu' ? type.nameHU : type.nameEN }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="units" class="form-label">{{ t("unit") }}</label>
                        <select name="unit" id="units" required v-model="modalData.unit" class="form-control">
                            <option v-for="(unit,index) in units" :value="unit" :selected="index == units.indexOf(modalData.unit)">{{ unit }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="image" class="form-label">{{ t("image") }}</label>
                        <input type="text" class="form-control" id="image" v-model="modalData.image" required>
                    </div>
                    <div v-if="items_error != ''" class="text-danger text-center mx-5 mb-2">{{ items_error }}</div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success">{{ t("save") }}</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css">

</style>