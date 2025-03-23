<script setup lang="ts">
  import RecipeCard from '@/components/RecipeCard.vue';
  import UserSideHeader from '@/components/UserSideHeader.vue';
  import { useRecipesStore } from '@/stores/recipesstore';
  import DataLoader from '@/utils/DataLoader';
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  let showAlltriggered = ref<boolean>(true);

  onMounted(()=>{
    DataLoader.loadRecipes();
  });
</script>

<template>
    <div class="container mt-2">
        <UserSideHeader :header-title="'recipesTitle'" :header-description="'recipes'"/>
        <div class="row">
          <span v-if="!showAlltriggered" v-on:click="showAlltriggered = true">
                <i class="bi bi-arrow-left" style="font-weight: bold; font-size: 1.5rem; cursor: pointer;"></i>
          </span>
          <div class="col-12 col-sm-6 col-md-5 col-xl-3 mt-2" v-for="recipe in useRecipesStore().recipes">
            <RecipeCard :recipe="recipe"/>
          </div>
        </div>
    </div>
</template>

<style lang="css" src="@/assets/css/userside.css">

</style>