<script setup lang="ts">
    import type IType from '@/models/Type';
    import { useAdminStore } from '@/stores/adminstore';
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { type_error } = storeToRefs(useAdminStore());
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["data"]);
    const emit = defineEmits(["saveData", "closeModal"]);

    const closeModal = () => {
        emit('closeModal');
    };

    const saveChanges = () => {
        emit('saveData', modalData);
    };

    let modalData = ref<IType>({
        id: props.data.id,
        name_HU: props.data.name_HU,
        name_EN: props.data.name_EN,
        image: props.data.image
    });

    const hideError = (): void => {
        type_error.value.hu = '';
        type_error.value.en = '';
    };

    const imageChanged = (event: any) => {
        const selectedImage = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            modalData.value.image = e.target!.result!.toString();
        };
        reader.readAsDataURL(selectedImage);
    };
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
                        <input type="text" class="form-control" id="nameHU" v-model="modalData.name_HU" v-on:focus="() => {if(type_error.hu && type_error.en) hideError()}">
                    </div>
                    <div class="mb-3">
                        <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                        <input type="text" class="form-control" id="nameEN" v-model="modalData.name_EN" v-on:focus="() => {if(type_error.hu && type_error.en) hideError()}">
                    </div>
                    <div class="mb-3">
                        <label for="image" class="form-label">{{ t("image") }}</label>
                        <input type="file" class="form-control" id="image" accept="images/*,.png,.jpg,.jpeg,.svg" v-on:change="imageChanged" v-on:focus="() => {if(type_error.hu && type_error.en) hideError()}">
                    </div>
                    <div v-if="type_error.hu != '' && type_error.en != ''" class="text-danger text-center mx-5 mb-2">{{ app_language == 'hu' ? type_error.hu : type_error.en }}</div>
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