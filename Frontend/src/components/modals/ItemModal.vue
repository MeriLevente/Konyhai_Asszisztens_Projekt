<script setup lang="ts">
    import type Item from '../../models/Item';
    import { useAppStore } from '../../stores/appstore'
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useItemStore } from '@/stores/itemstore';
    import { useTypeStore } from '@/stores/typestore';
    const { items_error, units } = storeToRefs(useItemStore());
    const { types } = storeToRefs(useTypeStore());
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["data"]);
    const emit = defineEmits(["saveData", "closeModal"]);
    
    onMounted(() => {
        useTypeStore().getTypes();
    });

    const closeModal = () => {
        emit('closeModal')
    }

    const saveChanges = () => {
        emit('saveData', modalData)
    }

    let modalData = ref<Item>({
        id: props.data.id,
        name: props.data.name,
        name_EN: props.data.name_EN,
        unit: props.data.unit,
        typeId: props.data.typeId,
        image: props.data.image
    });

    const hideError = (): void =>{
        items_error.value.hu = "";
        items_error.value.en = "";
    };
</script>

<template>
    <div class="background" v-if="data"></div>
    <div class="modal" tabindex="-1" v-if="data">
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
                        <input type="text" class="form-control" id="nameHU" v-model="modalData.name" 
                            v-on:focus="() => {if(items_error) hideError()}">
                    </div>
                    <div class="mb-3">
                        <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                        <input type="text" class="form-control" id="nameEN" v-model="modalData.name_EN" 
                            v-on:focus="() => {if(items_error) hideError()}">
                    </div>
                    <div class="mb-3">
                        <label for="types" class="form-label">{{ t("type") }}</label>
                        <select name="type" id="types" required v-model="modalData.typeId" class="form-control">
                            <option v-for="(type,index) in types" :value="type.id" :selected="index+1 == modalData.typeId">
                                {{ app_language == 'hu' ? type.name : type.name_EN }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="units" class="form-label">{{ t("unit") }}</label>
                        <select name="unit" id="units" required v-model="modalData.unit" class="form-control">
                            <option v-for="(unit,index) in units" :value="unit" :selected="index == units.indexOf(modalData.unit)">
                                {{ unit }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="image" class="form-label">{{ t("image") }}</label>
                        <input type="file" class="form-control" id="image" accept="images/*,.png,.jpg,.jpeg,.svg" 
                            v-on:focus="() => {if(items_error) hideError()}">
                    </div>
                    <div v-if="items_error" class="text-danger text-center mx-5 mb-2">
                        {{ app_language == "hu" ? items_error.hu : items_error.en }}
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

<style lang="css">
   .modal {
        transform: translateY(15%);
        display: block;
   }
   .background {
        width: 100%;
        min-height: 100000vh;
        position: absolute;
        left: 0;
        top: 0;
        background-color: black;
        opacity: 0.8;
        z-index: 1;
    }
</style>