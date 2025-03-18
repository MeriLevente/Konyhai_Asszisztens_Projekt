<script setup lang="ts">
    import type IRecipe from '@/models/Recipe';
    import router from '@/router';
    import { useUserStore } from '@/stores/userstore';
    import DataLoader from '@/utils/DataLoader';
    import { ref } from 'vue';

    const recipe_id: number = Number(router.currentRoute.value.query.id);
    let recipe = ref<IRecipe | undefined>();
    if(isNaN(recipe_id))
        router.push('/incorrect-id')
    else{
        DataLoader.loadViewedRecipe(recipe_id).then(()=>{
            recipe.value = useUserStore().viewedRecipe;
        }).catch((err: any)=>{
            alert(err.data.hu);
        });
    }
</script>

<template>
    {{ recipe }}
</template>

<style lang="css">

</style>