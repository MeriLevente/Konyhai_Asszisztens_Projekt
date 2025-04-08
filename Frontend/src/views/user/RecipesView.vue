<script setup lang="ts">
  import Paginator from '@/components/Paginator.vue';
  import RecipeCard from '@/components/recipes/RecipeCard.vue';
  import UserSideHeader from '@/components/UserSideHeader.vue';
  import { useRecipeStore } from '@/stores/recipestore';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const store = useRecipeStore();
  const { recipesLoading } = storeToRefs(store);
  const showAlltriggered = ref<boolean>(true);
  const maxLength = ref<number>(Number(sessionStorage.getItem("recipesMaxLength")) ?? store.recipes.length);
  const pagiVisibility = ref<boolean>(true);

  onMounted((): void => {
    if (!sessionStorage.getItem("recipesMaxLength")) {
        store.getAllRecipesLength().then((res: number): void => {
          maxLength.value = res;
        });
    };
    if (!sessionStorage.getItem("selectedRecipeType")) {
      sessionStorage.setItem("selectedRecipeType", "0");
    };
  });

  const loadRecipesPaginated = (paginatorValues: {from: number, to: number}): void => {
    recipesLoading.value = true;
    store.loadRecipesPaginated(paginatorValues.from, paginatorValues.to)
    .then((): void => {
      recipesLoading.value = false;
    })
    .catch((err: string): void => {
      recipesLoading.value = false;
      console.error(err);
    });
  };

  const changePagiVisibility = (show: boolean): void => {
    pagiVisibility.value = show;
  };
</script>

<template>
    <main class="container mt-2">
        <UserSideHeader :header-title="'recipesTitle'" 
          :header-description="'recipes'" v-on:type-changed-disable-pagi="changePagiVisibility"/>
        <div class="row mt-2 py-2" v-if="pagiVisibility">
          <Paginator :page="'recipes'" class="my-2"
            :max-length="store.recipesAllLength" v-on:paginator-triggered="loadRecipesPaginated"/>
        </div>
        <div class="row py-2" style="height: auto;" v-if="!recipesLoading">
          <span v-if="!showAlltriggered" v-on:click="showAlltriggered = true">
            <i class="bi bi-arrow-left" style="font-weight: bold; font-size: 1.5rem; cursor: pointer;"></i>
          </span>
          <div v-if="useRecipeStore().recipes.length > 0" class="col-12 col-sm-6 col-md-5 col-xl-4 mt-2" 
            v-for="recipe in useRecipeStore().recipes">
            <RecipeCard :recipe="recipe"/>
          </div>
        </div>
        <div v-if="useRecipeStore().recipes.length == 0 && !recipesLoading" class="nodata-div w-75 mx-auto mt-5 p-3">
            <h3 class="text-center">{{ t("no_data") }}</h3>
        </div>
        <div class="d-flex justify-content-center mt-5" v-if="recipesLoading">
            <span class="spinner-border spinner-border-bg text-center"></span>
        </div>
    </main>
</template>

<style lang="css" src="@/assets/css/userside.css"/>