<script setup lang="ts">
    import QuantityChanger from './QuantityChanger.vue';
    import NewItemPopup from './NewItemPopup.vue';
    const props = defineProps(["popuptype", "quantitymethod", "modifiedItem"]);
    const emit = defineEmits(["close"]);

    const close = (): void => {
        emit("close");
    };
</script>

<template>
    <div class="popup-bg">
        <div class="popup w-100 mx-auto p-3">
            <QuantityChanger
                :method="props.quantitymethod"
                v-if="props.popuptype == 'quantity'"
                :modifiedItem="props.modifiedItem"
                v-on:close="close"/>
            <NewItemPopup v-if="props.popuptype == 'new'" v-on:close="close"/>
        </div>
    </div>

</template>

<style lang="css">
    .popup-bg {
        min-height: 85vh;
    }
    .popup {
        transform: translateY(15%);
        position: relative;
        min-height: 40vh;
        color: white;
        background-color: var(--barley);
        border-radius: 5px;
        border: var(--ebony-clay) 10px solid;
    }
</style>