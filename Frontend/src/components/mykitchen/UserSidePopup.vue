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
        <div class="popup w-100 p-3">
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
        position: fixed;
        top: 50%;
        left: 50%;
        margin-left: -30vh;
        margin-top: -20vh;
    }
    .popup {
        position: relative;
        color: white;
        background-color: var(--barley);
        border-radius: 5px;
        border: var(--ebony-clay) 10px solid;
    }

    @media only screen and (max-width: 990px) {
        .popup-bg {
            margin-left: -48vw;
            margin-top: -25vh;
        }
    }
</style>