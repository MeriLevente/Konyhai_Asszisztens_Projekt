<script setup lang="ts">
    import { useAdminStore } from '@/stores/adminstore';
    import DataLoader from '@/utils/DataLoader';

    DataLoader.loadRecipes();
    let id: number = 1;
</script>

<template>
    <div class="container mt-2">
        Recipes
        <div v-for="recipe in useAdminStore().recipes">
            <RouterLink :to="{ path: 'recipe', query: { id: `${recipe.id}` }}">{{ recipe.name }}</RouterLink>
        </div>
        
    </div>
</template>

<style lang="css">

</style>