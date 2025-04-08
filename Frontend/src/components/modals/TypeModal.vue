<script setup lang="ts">
    import type IType from '@/models/Type';
    import { useAppStore } from '@/stores/appstore';
    import { useTypeStore } from '@/stores/typestore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { typesError } = storeToRefs(useTypeStore());
    const { t } = useI18n();
    const props = defineProps(["data"]);
    const emit = defineEmits(["saveData", "closeModal"]);

    const closeModal = (): void => {
        emit('closeModal');
    };

    const saveChanges = (): void => {
        emit('saveData', modalData);
    };

    const modalData = ref<IType>({
        id: props.data.id,
        name: props.data.name,
        name_EN: props.data.name_EN,
        image: props.data.image
    });

    const hideError = (): void => {
        typesError.value.en = '';
        typesError.value.hu = '';
    };
</script>

<template>
    <div class="background" v-if="data"></div>
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
                            <input type="text" class="form-control" id="nameHU" v-model="modalData.name"
                                v-on:focus="() => {if (typesError) hideError()}">
                        </div>
                        <div class="mb-3">
                            <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                            <input type="text" class="form-control" id="nameEN" v-model="modalData.name_EN"
                                v-on:focus="() => {if (typesError) hideError()}">
                        </div>
                        <div class="mb-3">
                            <label for="image" class="form-label">{{ t("image") + " Url" }}</label>
                            <input type="text" class="form-control" id="image" v-model="modalData.image"
                                v-on:focus="() => {if (typesError) hideError()}">
                        </div>
                        <div v-if="typesError" class="text-danger text-center mx-5 mb-2">
                            {{ useAppStore().appLanguage == "hu" ? typesError.hu : typesError.en }}
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success">{{ t("save") }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css"/>