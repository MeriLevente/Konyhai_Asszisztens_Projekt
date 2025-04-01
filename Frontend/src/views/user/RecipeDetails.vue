<script setup lang="ts">
    import RecipeBookLeftPage from '@/components/recipes/RecipeBookLeftPage.vue';
    import RecipeBookRightPage from '@/components/recipes/RecipeBookRightPage.vue';
    import type IRecipe from '@/models/Recipe';
    import router from '@/router';
    import { useUserStore } from '@/stores/userstore';
    import DataLoader from '@/utils/DataLoader';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';

    const recipe_id: number = Number(router.currentRoute.value.query.id);
    let recipe = ref<IRecipe | undefined>();
    if(isNaN(recipe_id))
        router.push('/incorrect-id')

    onMounted(()=> {
      DataLoader.loadViewedRecipe(recipe_id).then(()=>{
            recipe.value = useUserStore().viewedRecipe;
        }).catch((err: any)=>{
            router.push('/error');
        });
    })
</script>

<template>
  <div class="recipe-content-box">
    <div class="container rec-container my-3 mt-5">
      <div class="row">
        <div class="col-12 col-lg-6 left-col pt-3">
          <RecipeBookLeftPage :recipe="recipe" v-if="recipe"/>
        </div>
        <div class="col-12 col-lg-6 pt-5">
          <RecipeBookRightPage :recipe="recipe" v-if="recipe"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
    .recipe-content-box {
      display: flex; 
    }
  .rec-container{
      background-color: white;
      border: 3px solid var(--ebony-clay);
      border-radius: 5px;
      box-shadow: 8px 12px var(--ebony-clay);
  }
  .left-col {
    border-right: 1px solid black;
  }
</style>