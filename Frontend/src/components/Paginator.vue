<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';
    const emit = defineEmits(["paginatorTriggered"]);
    const props = defineProps(["maxLength", "page"]);
    const { paginatorLastElementDeleted } = storeToRefs(useAppStore());
    const paginatorValue = ref<number>(6);
    const paginatorFrom = ref<number>(Number(sessionStorage.getItem("paginator-from")) ?? 0);
    const paginatorTo = ref<number>(Number(sessionStorage.getItem("paginator-to")) ?? 6);

    const goBack = (): void => {
        if (paginatorFrom.value - Number(paginatorValue.value) > 0) {
            paginatorFrom.value -= Number(paginatorValue.value);
            paginatorTo.value -= Number(paginatorValue.value);
        } else {
            paginatorFrom.value = 0;
            paginatorTo.value = paginatorValue.value;
        }
        emit("paginatorTriggered", {from: paginatorFrom.value, to: paginatorTo.value});
    };

    const goForward = (): void => {
        paginatorFrom.value += Number(paginatorValue.value);
        paginatorTo.value = paginatorFrom.value + Number(paginatorValue.value);
        useAppStore().paginatorLastElementDeleted = false;
        emit("paginatorTriggered", {from: paginatorFrom.value, to: paginatorTo.value});
    };

    const paginatorValueChanged = (): void => {
        if (paginatorFrom.value == 0)
            emit('paginatorTriggered', {from: paginatorFrom.value, to: paginatorFrom.value + paginatorValue.value});
    };

    onMounted((): void => {
        if (sessionStorage.getItem("paginator-page") != props.page.toString()) {
            paginatorFrom.value = 0;
            paginatorTo.value = paginatorValue.value;
        };
        sessionStorage.setItem("paginator-page", props.page.toString());
        if (!sessionStorage.getItem("paginator-from") || !sessionStorage.getItem("paginator-to")) {
            paginatorFrom.value = 0;
            paginatorTo.value = paginatorValue.value;
        };
        emit("paginatorTriggered", {from: paginatorFrom.value, to: paginatorTo.value});
    });
</script>

<template>
    <div class="row d-flex justify-content-center">
        <div class="col-4 col-sm-5 d-flex justify-content-end">
            <button v-on:click="goBack" :disabled="paginatorFrom == 0 || paginatorLastElementDeleted" data-cy="paginator-back">
                <i class="bi bi-arrow-left"></i>
            </button>
        </div>
        <div class="col-4 col-sm-1">
            <select v-model="paginatorValue" class="w-100"
                v-on:change="paginatorValueChanged" data-cy="paginator-select">
                <option value="6" :selected="paginatorTo == 6">6</option>
                <option value="10">10</option>
            </select>
        </div>
        <div class="col-4 col-sm-5 d-flex justify-content-start">
            <button v-on:click="goForward"
                :disabled="maxLength - paginatorFrom <= paginatorValue" data-cy="paginator-forward">
                <i class="bi bi-arrow-right"></i>
            </button>
        </div>
    </div> 
</template>

<style lang="css" scoped>
   button {
        background-color: var(--ebony-clay);
        color: white;
        font-weight: bold;
        border-radius: 20px;
   }

   button:disabled {
        opacity: 0.3;
   }

   select {
        border-radius: 20px;
        border: 1px solid var(--ebony-clay);
        font-weight: bold;
   }
</style>