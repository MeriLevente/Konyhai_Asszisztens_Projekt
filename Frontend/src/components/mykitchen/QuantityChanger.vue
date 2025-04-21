<script setup lang="ts">
    import type IStoredItem from '@/models/StoredItem';
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import { storeToRefs } from 'pinia';
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { appLanguage } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["method", "modifiedItem"]);
    const emit = defineEmits(["save", "close"]);
    const inputQuantity = ref<number>(0);
    
    const newQuantity = computed((): number => {
        if (inputQuantity.value >= 10000)
            inputQuantity.value = 10000;
        if (inputQuantity.value < 0)
            inputQuantity.value = 0;
        if (!Number.isInteger(inputQuantity.value))
            inputQuantity.value = Math.floor(inputQuantity.value);
        if (props.method == "reduce") {
            if (inputQuantity.value > props.modifiedItem.quantity)
                return 0;
            return props.modifiedItem.quantity - inputQuantity.value;
        }   
        else
            return props.modifiedItem.quantity + inputQuantity.value;
    });

    const zerofier = (): void => {
        inputQuantity.value = props.modifiedItem.quantity;
    };

    const close = (): void => {
        emit("close");
    };

    const save = (): void => {
        const request: IStoredItem = {
            userId: useUserStore().user!.id!,
            itemId: props.modifiedItem.storedItem.id,
            quantity: newQuantity.value
        };
        useUserStore().updateQuantity(request, "update").then((): void => {
            emit("close");
        });
    };
</script>

<template>
    <h2 class="text-center qty-header mb-2">{{ t("QuantityChanger") }}</h2>
    <h5 class="text-center mb-3 qty-header">
        {{ appLanguage == "hu" ? props.modifiedItem.storedItem.name : props.modifiedItem.storedItem.name_EN }}
    </h5>
    <div class="d-flex justify-content-center">
        <img v-if="props.method == 'add'" src="@/assets/images/uparrow.png" :alt="props.method" class="arrow me-3">
        <img v-if="props.method == 'reduce'" src="@/assets/images/downarrow.png" :alt="props.method" class="arrow me-3">
        <span class="old-qty-span qty-font py-5 px-3">{{ props.modifiedItem.quantity }}</span>
        <i class="bi bi-arrow-right qty-arrow align-self-center"></i>
        <span class="old-qty-span qty-font py-5  px-3"><input v-model="inputQuantity" 
            class="qty-input" type="number" min="0" max="10000"></span>
        <i class="bi bi-arrow-right qty-arrow align-self-center"></i>
        <span class="old-qty-span qty-font py-5  px-3">{{ newQuantity }}</span>
        <span class="align-self-center ms-1 unit-span-qty" style="height: 3rem;">
            {{ t(props.modifiedItem.storedItem.unit) }}
        </span>
    </div>
    <div class="d-flex justify-content-center">
        <span v-if="useUserStore().status.message || useUserStore().status.messageEn" class="text-center text-danger">
            {{ appLanguage == "hu" ? useUserStore().status.message : useUserStore().status.messageEn}}
        </span>
        <button class="btn" v-on:click="zerofier" v-if="props.method == 'reduce'">{{ t("delete") }}</button>
        <button class="btn" v-on:click="save">{{ t("save") }}</button>
        <button class="btn" v-on:click="close">{{ t("cancel") }}</button>
    </div>
</template>

<style lang="css" src="@/assets/css/quantitychanger.css"/>