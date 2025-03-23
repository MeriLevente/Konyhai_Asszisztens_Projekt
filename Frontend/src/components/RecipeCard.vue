<script setup lang="ts">
  import { useAdminStore } from '@/stores/adminstore';
  import { useAppStore } from '@/stores/appstore';
  import { useRecipeStore } from '@/stores/recipestore';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  const { app_language } = storeToRefs(useAppStore());
  const props = defineProps(["recipe"]);
  const { t } = useI18n();
  const router = useRouter();

  const navigateToRecipe = (id: number): void => {
    router.push(`recipe?id=${id}`);
  }

  const convertRecipeTime = (time: number): string => {
    const hours: number = Math.floor(time / 60);
    const minutes: number = time % 60;
    return `${hours > 0 ? `${hours} ${t("hour")} ` : ''}${minutes > 0 ? `${minutes} ${t("minute")}` : ''}`;
  }

  const setTypeTooltip = (type: string): {short: string, hu: string, en: string} => {
    return useRecipeStore().recipe_types.find(x=> x.short == type) ?? {short: "", hu: "Típus nem található", en: "Type not found!"};
  }

  const setDiffColour = (diff: number): string => {
    let colour: string = "hard";
    if(diff <= 4)
      colour = "easy";
    if(diff >= 5 && diff <= 7)
      colour = "normal";
    return `diff-span-${colour}`;
  }

</script>

<template>
    <div class="stored-card card" style="cursor: pointer;" v-on:click="navigateToRecipe(recipe.id)">
        <img class="card-img-top" :src="recipe.image" :alt="`${recipe.name_EN} image`">
        <div class="card-body">
          <h2 class="card-title" style="font-size: 1.1rem;">{{ app_language == 'hu' ? recipe.name : recipe.name_EN }}</h2>
          <div style="position: relative;">
            <div style="float: left;">
              <p class="card-text">{{ convertRecipeTime(recipe.time) }}</p>
            </div>
            <div style="float: right;">
              <span class="recipe-rounded-span" :class="setDiffColour(recipe.difficulty)">{{recipe.difficulty}}/10</span>

              <span class="recipe-rounded-span"
                data-toggle="tooltip" data-placement="top"
                :title="app_language == 'hu' ? setTypeTooltip(recipe.type).hu : setTypeTooltip(recipe.type).en">
                {{ recipe.type }}
              </span>
            </div>
          </div>
        </div>
    </div>
</template>

<style lang="css">
  .recipe-rounded-span {
    border-radius: 20px;
    background-color: var(--ebony-clay);
    color: white;
    padding: 4px;
    font-weight: bold;
    margin-right: 2px;
  }
  .diff-span-easy{
    background-color: green;
  }
  .diff-span-normal{
    background-color: orange;
  }
  .diff-span-hard{
    background-color: red;
  }
</style>