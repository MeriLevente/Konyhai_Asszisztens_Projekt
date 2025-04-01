<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["method", "modifiedItem"]);
    
</script>

<template>
    <h2 class="text-center popup-h2 mb-2">QuantityChanger</h2>
    <h5 class="text-center">{{ app_language == "hu" ? props.modifiedItem.storedItem.name : props.modifiedItem.storedItem.name_EN }}</h5>
    <span class="old-qty-span qty-font p-4">{{ props.modifiedItem.quantity }}</span>
    <span class="old-qty-span qty-font p-4"><input class="qty-input" type="number" min="0" max="10000"></span>
    quantity changer {{ props.method }}
</template>

<style lang="css">
    .old-qty-span{
        background-color: white;
        border-color: 3px var(--ebony-clay) solid;
        border-radius: 15px;
    }
    .qty-font {
        color: var(--ebony-clay);
        font-size: 4rem;
        font-weight: bold;
    }
    .qty-input {
        font-family: "Tiny5", sans-serif;
        color: var(--ebony-clay);
        border: none;
    }
    .qty-input:focus {
        outline: none;
    }
</style>