<script setup lang="ts">
    import router from '@/router';

    const recipe_id: number = Number(router.currentRoute.value.query.id);
    if(isNaN(recipe_id))
        router.push('/incorrect-id')
</script>

<template>
    Recipe details {{ recipe_id }} id
</template>

<style lang="css">

</style>