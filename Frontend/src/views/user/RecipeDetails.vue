<script setup lang="ts">
    import type IRecipe from '@/models/Recipe';
    import router from '@/router';
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import DataLoader from '@/utils/DataLoader';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';

    const { app_language } = storeToRefs(useAppStore());
    const recipe_id: number = Number(router.currentRoute.value.query.id);
    let recipe = ref<IRecipe | undefined>();
    if(isNaN(recipe_id))
        router.push('/incorrect-id')

    onMounted(()=> {
      DataLoader.loadViewedRecipe(recipe_id).then(()=>{
            recipe.value = useUserStore().viewedRecipe;
        }).catch((err: any)=>{
            console.error(err);
            router.push('/incorrect-id');
        });
    })
</script>

<template>
  <div class="recipe-content-box my-3">
    <div class="container rec-container">
      <div class="row pt-5">
        <div class="col-12 col-md-6">
          <h2>{{ app_language == 'hu' ? recipe?.name : recipe?.name_EN }}</h2>
          <img src="" alt="">
        </div>
        <div class="col-12 col-md-6">
          <ul>
            <li v-for="ingr in recipe?.ingredients">
              {{ `${app_language == 'hu' ? ingr.item.name : ingr.item.name_EN}, ${ingr.quantity} ${ingr.item.unit}` }}
            </li>
          </ul>
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
  }
</style>