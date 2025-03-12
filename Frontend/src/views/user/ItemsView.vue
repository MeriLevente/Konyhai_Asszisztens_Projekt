<script setup lang="ts">
    import { useUserStore } from '@/stores/userstore';
    useUserStore().getStoredItems().then(()=>{
       
    });
</script>

<template>
    <div class="container mt-2">
        Items
        <div v-for="item in useUserStore().storedItems" data-cy="stored-item">
            {{ item.storedItem.name }}
            {{ item.quantity }}
        </div>
    </div>
</template>

<style lang="css">

</style>