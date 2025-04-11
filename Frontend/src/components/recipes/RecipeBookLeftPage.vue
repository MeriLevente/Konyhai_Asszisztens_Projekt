<script setup lang="ts">
    import { useRecipeStore } from '@/stores/recipestore';
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    import { useI18n } from 'vue-i18n';
    import { useRouter } from 'vue-router';
    const { appLanguage } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
    const router = useRouter();
    const type = useRecipeStore().recipeTypes.find(x=> x.short == props.recipe.type!);

    const goBack = (): void => {
        router.back();
    };
</script>

<template>
    <div class="m-3">
        <span v-on:click="goBack()">
            <i class="bi bi-arrow-left" style="font-weight: bold; font-size: 1.5rem; cursor: pointer;"></i>
        </span>
        <h2 class="text-center" data-cy="recipe-title">{{ appLanguage == 'hu' ? recipe?.name : recipe?.name_EN }}</h2>
        <h6 class="text-center" v-if="type" data-cy="recipe-type">
            {{ appLanguage == "hu" ? type.hu : type.en }}
        </h6>
        <div class="d-flex justify-content-center mt-1">
            <img :src="recipe.image" :alt="recipe?.name_EN + ' image'" class="recipebook-img">
        </div>
        <p class="text-center">{{ t("recipeimgtext") }}</p>
        <p class="text-center mt-5"  data-cy="recipe-id">{{ recipe.id }}</p>
    </div>
</template>

<style lang="css">
    .recipebook-img {
        border: 2px solid var(--ebony-clay);
        width: 30rem;
        height: 30rem;
    }

    @media only screen and (max-width: 580px) {
        .recipebook-img {
            width: 20rem;
            height: 20rem;
        }
    }
</style>