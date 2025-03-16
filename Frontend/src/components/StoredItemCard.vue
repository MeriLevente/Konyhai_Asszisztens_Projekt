<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import { storeToRefs } from 'pinia';
    const { app_language } = storeToRefs(useAppStore());
    const props = defineProps(["item"]);
    console.log(props.item)
</script>

<template>
    <div class="stored-card card p-2">
        <h2 class="card-title">{{ app_language == 'hu' ? item.storedItem.name : item.storedItem.name_EN }}</h2>
        <p>{{ `${item.quantity} ${item.storedItem.unit}` }}</p>
    </div>
    
</template>

<style lang="css">
   .stored-card{
        border: 2px solid var(--ebony-clay);
        border-radius: 20px;
        background-color: white;
        color: var(--ebony-clay);
        font-weight: bold;
   }
</style>