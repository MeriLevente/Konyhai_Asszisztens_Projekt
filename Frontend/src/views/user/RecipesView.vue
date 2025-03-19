<script setup lang="ts">
  import RecipeCard from '@/components/RecipeCard.vue';
  import { useAdminStore } from '@/stores/adminstore';
  import DataLoader from '@/utils/DataLoader';
  import { onMounted } from 'vue';

  onMounted(()=>{
    DataLoader.loadRecipes();
  });
</script>

<template>
    <div class="container mt-2">
        Recipes
        <div class="row">
          <div class="col-12 col-sm-6 col-md-5 col-xl-3" v-for="recipe in useAdminStore().recipes">
            <RecipeCard :recipe="recipe"/>
          </div>
        </div>
    </div>
</template>

<style lang="css">

</style>