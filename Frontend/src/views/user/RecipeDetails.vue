<script setup lang="ts">
    import RecipeBookLeftPage from '@/components/recipes/RecipeBookLeftPage.vue';
    import RecipeBookRightPage from '@/components/recipes/RecipeBookRightPage.vue';
    import type IRecipe from '@/models/Recipe';
    import router from '@/router';
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import { storeToRefs } from 'pinia';
    const { storageLoading } = storeToRefs(useUserStore());
    import { onMounted, ref } from 'vue';
    const recipe_id: number = Number(router.currentRoute.value.query.id);
    const recipe = ref<IRecipe | undefined>();

    if (isNaN(recipe_id))
      router.push('/incorrect-id');

    onMounted((): void => {
      useUserStore().getRecipeById(recipe_id)
      .then((): void => {
        recipe.value = useUserStore().viewedRecipe;
      });
    });
</script>

<template>
  <main class="recipe-content-box px-3">
    <div class="container d-flex justify-content-center mt-5" v-if="storageLoading || useUserStore().status.message">
        <span v-if="storageLoading" class="spinner-border spinner-border-bg text-center"></span>
        <span v-if="useUserStore().status.message" class="text-center" data-cy="recipe-notfound">
          {{ useAppStore().appLanguage == "hu" ? useUserStore().status!.message : useUserStore().status!.messageEn }}
        </span>
    </div>
    <div class="container rec-container my-3 mt-5" v-if="!storageLoading && !useUserStore().status.message">
      <div class="row">
        <div class="col-12 col-lg-6 left-col pt-3">
          <RecipeBookLeftPage :recipe="recipe" v-if="recipe"/>
        </div>
        <div class="col-12 col-lg-6 pt-5">
          <RecipeBookRightPage :recipe="recipe" v-if="recipe"/>
        </div>
      </div>
    </div>
  </main>
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