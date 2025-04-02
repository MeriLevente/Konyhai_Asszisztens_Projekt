<script setup lang="ts">
    import type StoredItem from '@/models/StoredItem';
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import { storeToRefs } from 'pinia';
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["method", "modifiedItem"]);
    const emit = defineEmits(["save", "close"])
    const inputQuantity = ref<number>(0);
    
    const newQuantity = computed(()=>{
        if (inputQuantity.value >= 10000)
            inputQuantity.value = 10000;
        if (props.method == "reduce"){
            if (inputQuantity.value > props.modifiedItem.quantity)
                return 0;
            return props.modifiedItem.quantity - inputQuantity.value ;
        }   
        else
            return props.modifiedItem.quantity + inputQuantity.value;
    });

    const zerofier = (): void => {
        inputQuantity.value = props.modifiedItem.quantity
    };

    const close = (): void => {
        emit("close");
    };

    const save = (): void => {
        const request: StoredItem = {
            userId: useUserStore().user!.id!,
            itemId: props.modifiedItem.storedItem.id,
            quantity: newQuantity.value
        };
        useUserStore().updateQuantity(request, "update").then(()=>{
            emit("close")
        });
    };
</script>

<template>
    <h2 class="text-center qty-header mb-2">{{ t("QuantityChanger") }}</h2>
    <h5 class="text-center mb-3 qty-header">{{ app_language == "hu" ? props.modifiedItem.storedItem.name : props.modifiedItem.storedItem.name_EN }}</h5>
    <div class="d-flex justify-content-center">
        <img v-if="props.method == 'add'" src="@/assets/images/uparrow.png" :alt="props.method" class="arrow me-3">
        <img v-if="props.method == 'reduce'" src="@/assets/images/downarrow.png" :alt="props.method" class="arrow me-3">
        <span class="old-qty-span qty-font py-5 px-3">{{ props.modifiedItem.quantity }}</span>
        <i class="bi bi-arrow-right qty-arrow align-self-center"></i>
        <span class="old-qty-span qty-font py-5  px-3"><input v-model="inputQuantity" class="qty-input" type="number" min="0" max="10000"></span>
        <i class="bi bi-arrow-right qty-arrow align-self-center"></i>
        <span class="old-qty-span qty-font py-5  px-3">{{ newQuantity }}</span>
        <span class="align-self-center ms-1 unitSpanQty" style="height: 3rem;">{{ t(props.modifiedItem.storedItem.unit) }}</span>
    </div>
    <div class="d-flex justify-content-center">
        <span v-if="useUserStore().status.message || useUserStore().status.messageEn" class="text-center text-danger">
            {{ app_language == "hu" ? useUserStore().status.message : useUserStore().status.messageEn}}
        </span>
        <button class="btn" v-on:click="zerofier" v-if="props.method == 'reduce'">{{ t("delete") }}</button>
        <button class="btn" v-on:click="save">{{ t("save") }}</button>
        <button class="btn" v-on:click="close">{{ t("cancel") }}</button>
    </div>
</template>

<style lang="css">
    .old-qty-span{
        background-color: white;
        border-color: 3px var(--ebony-clay) solid;
        border-radius: 15px;
    }
    .qty-font {
        color: var(--ebony-clay);
        font-size: 3.75rem;
        font-weight: bold;
    }
    .qty-input {
        font-family: "Tiny5", sans-serif;
        color: var(--ebony-clay);
        border: none;
        width: 12rem;
    }
    .qty-input:focus {
        outline: none;
    }
    .qty-arrow {
        color: black;
        font-weight: bold;
        font-size: 3rem;
    }
    .qty-header {
        color: black;
    }
    .unitSpanQty {
        color: black;
        font-weight: bold;
        font-size: 1.3rem;
    }
    .arrow {
        width: 5rem;
        height: 10rem;
    }

    @media only screen and (max-width: 995px) {
        .qty-font {
            font-size: 2rem;
        }
        .qty-input {
            width: 8rem;
        }
        .qty-arrow {
            font-size: 2rem;
        }
        .unitSpanQty {
            font-size: 1rem;
        }
        .old-qty-span {
            padding: 1rem;
        }
    }

    @media only screen and (max-width: 770px) {
        .qty-font {
            font-size: 1.5rem;
        }
        .qty-input {
            width: 6rem;
        }
        .qty-arrow {
            font-size: 1.5rem;
        }
        .unitSpanQty {
            font-size: 1rem;
        }
        .old-qty-span {
            padding: 1rem;
        }
    }

    @media only screen and (max-width: 500px) {
        .qty-font {
            font-size: 1.1rem;
        }
        .qty-input {
            width: 4.5rem;
        }
        .qty-arrow {
            font-size: 1rem;
        }
        .unitSpanQty {
            font-size: 1rem;
        }
        .old-qty-span {
            padding: 1rem;
        }
        .arrow {
            width: 2rem;
            height: 7rem;
        }
    }
</style>