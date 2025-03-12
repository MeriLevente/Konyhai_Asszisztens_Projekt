<script setup lang="ts">
    let id: number = 1;
</script>

<template>
    <div class="container mt-2">
        Recipes
        <RouterLink :to="{ path: 'recipe', query: { id: `${id}` }}">{{ id }}</RouterLink>
    </div>
</template>

<style lang="css">

</style>