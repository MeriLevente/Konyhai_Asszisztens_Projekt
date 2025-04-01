<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import QuantityChanger from './QuantityChanger.vue';
    import NewItemPopup from './NewItemPopup.vue';
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["popuptype", "quantitymethod", "modifiedItem"]);
    const emit = defineEmits(["close"]);

    const close = (): void => {
        emit("close");
    };
</script>

<template>
    <div class="popup-bg">
        <div class="popup w-75 mx-auto p-3">
            <QuantityChanger :method="props.quantitymethod" v-if="props.popuptype == 'quantity'" :modifiedItem="props.modifiedItem"/>
            <NewItemPopup v-if="props.popuptype == 'new'" v-on:close="close"/>
        </div>
    </div>
    
</template>

<style lang="css">
    .popup-bg {
        min-height: 85vh;
    }
    .popup {
        transform: translateY(50%);
        position: relative;
        min-height: 40vh;
        color: white;
        background-color: var(--barley);
        border-radius: 5px;
        border: var(--ebony-clay) 3px solid;
    }
</style>