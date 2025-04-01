<script setup lang="ts">
  import Paginator from '@/components/Paginator.vue';
  import RecipeCard from '@/components/recipes/RecipeCard.vue';
  import UserSideHeader from '@/components/UserSideHeader.vue';
  import { useRecipeStore } from '@/stores/recipestore';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const store = useRecipeStore();
  let showAlltriggered = ref<boolean>(true);
  let maxLength = ref<number>(Number(sessionStorage.getItem("recipesMaxLength")) ?? store.recipes.length);
  let pagiVisibility = ref<boolean>(true);

  if (!sessionStorage.getItem("recipesMaxLength")) {
        store.getAllRecipesLength().then((res: number)=>{
          maxLength.value = res;
      });
  }
  if (!sessionStorage.getItem("selectedRecipeType")){
    sessionStorage.setItem("selectedRecipeType", "0");
  };

  const loadRecipesPaginated = (paginatorValues: {from: number, to: number}): void => {
    store.loadRecipesPaginated(paginatorValues.from, paginatorValues.to).catch((err: string)=>{console.error(err)});
  };

  const changePagiVisibility = (show: boolean): void => {
    pagiVisibility.value = show;
  };
</script>

<template>
    <div class="container mt-2">
          <UserSideHeader :header-title="'recipesTitle'" :header-description="'recipes'" v-on:type-changed-disable-pagi="changePagiVisibility"/>
          <div class="row mt-2 py-2" style="height: auto;">
            <Paginator :page="'recipes'" class="my-2" v-if="pagiVisibility"
              :max-length="store.recipesAllLength" v-on:paginator-triggered="loadRecipesPaginated"/>
            <span v-if="!showAlltriggered" v-on:click="showAlltriggered = true">
                <i class="bi bi-arrow-left" style="font-weight: bold; font-size: 1.5rem; cursor: pointer;"></i>
            </span>
            <div v-if="useRecipeStore().recipes.length > 0" class="col-12 col-sm-6 col-md-5 col-xl-4 mt-2" v-for="recipe in useRecipeStore().recipes">
              <RecipeCard :recipe="recipe"/>
            </div>
        </div>
        <div v-if="useRecipeStore().recipes.length == 0" class="nodata-div w-75 mx-auto mt-5 p-3">
            <h3 class="text-center">{{ t("no_data") }}</h3>
        </div>
    </div>
</template>

<style lang="css" src="@/assets/css/userside.css">

</style>