<script setup lang="ts">
    let id: number = 1;
</script>

<template>
    Recipes
    <RouterLink :to="{ path: 'recipe', query: { id: `${id}` }}">{{ id }}</RouterLink>
</template>

<style lang="css">

</style>