<script setup lang="ts">
    import { useAdminStore } from '@/stores/adminstore';
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    import { useI18n } from 'vue-i18n';
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
</script>

<template>
    <div class="my-3 page-content">
        <div style="float: left;">
            {{ `${t("difficulty")}: ${recipe.difficulty} / 10`}}
        </div>
        <div style="float: right;">
            {{ `${t("time")}: ${recipe.time} `}}
        </div>
        <h3 class="pt-5">{{ t("ingredients" )}}</h3>
        <ul>
            <li v-for="ingr in recipe?.ingredients">
                {{ `${app_language == 'hu' ? ingr.item.name : ingr.item.name_EN}, ${ingr.quantity} ${t(ingr.item.unit)}` }}
            </li>
        </ul>
        <h3>{{ t("prep" )}}</h3>
        <ol>
            <li class="mt-2" v-if="app_language == 'hu'" v-for="step in recipe?.description.split('#')">
                {{ step }}
            </li>
            <li class="mt-2" v-if="app_language == 'en'" v-for="step in recipe?.description_EN.split('#')">
                {{ step }}
            </li>
        </ol>
        <button class="cook-btn">{{ t("letmecook") }}</button>
        <p class="text-center mt-5">{{ recipe.id + 1 }}</p>
    </div>
</template>

<style lang="css" scoped>
    h3 {
        border-bottom: 2px solid black;
        margin-top: 3.5rem;
    }
    button {
        margin-left: 40%;
        background-color: var(--ebony-clay);
        color: white;
    }
    .page-content {
        padding-top: 3.1rem;
    }
</style>