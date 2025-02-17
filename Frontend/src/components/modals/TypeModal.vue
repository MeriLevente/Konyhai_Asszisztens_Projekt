<script setup lang="ts">
    import type IType from '@/models/Type';
    import { useAdminStore } from '@/stores/adminstore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { type_error } = storeToRefs(useAdminStore())
    const { t } = useI18n();
    const props = defineProps(["data"]);
    const emit = defineEmits(["saveData", "closeModal"])

    const closeModal = () => {
        emit('closeModal')
    }

    const saveChanges = () => {
        emit('saveData', modalData)
    }

    let modalData = ref<IType>({
        nameHU: props.data.nameHU,
        nameEN: props.data.nameEN,
        image: props.data.image
    });

</script>

<template>
   <div class="modal" tabindex="-1" style="display: block;" v-if="data">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ t("edit_type") }}</h5>
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
                        <label for="image" class="form-label">{{ t("image") }}</label>
                        <input type="text" class="form-control" id="image" v-model="modalData.image" required>
                    </div>
                    <div v-if="type_error != ''" class="text-danger text-center mx-5 mb-2">{{ type_error }}</div>
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