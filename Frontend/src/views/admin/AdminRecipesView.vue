<script setup lang="ts">
    import RecipeEditor from '@/components/recipes/RecipeEditor.vue';
    import type IRecipe from '@/models/Recipe';
    import { useRecipesStore } from '@/stores/recipesstore';
    import DataLoader from '@/utils/DataLoader';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useRecipesStore();
    let openEditor = ref(false);

    DataLoader.loadRecipes();

    let data = ref<IRecipe | null>();

    const addRecipe = () => {
        data.value = {
            name: "",
            name_EN: "",
            description: "",
            description_EN: "",
            type: "AME",
            difficulty: 0,
            time: 0,
            image: "",
            ingredients: []
        };
        openEditor.value = true;
    };

    const editRecipe = (selected: IRecipe) => {
        data.value = {
            id: selected.id,
            name: selected.name,
            name_EN: selected.name_EN,
            description: selected.description,
            description_EN: selected.description_EN,
            type: selected.type,
            difficulty: selected.difficulty,
            time: selected.time,
            image: selected.image,
            ingredients: selected.ingredients
        };
        openEditor.value = true;
    };

    const deleteRecipe = (selected: IRecipe) => {
        store.deleteRecipe(selected).then().catch();
    };

    const saveData = (recipe: IRecipe) => {
        store.saveRecipes(recipe)?.then(()=>closeEditor()).catch();
    };

    const closeEditor = () => {
        openEditor.value = false;
        data.value = null;
    };
</script>

<template>
    <div class="container my-5 justify-center" v-if="openEditor == false" style="font-family: Funnel Sans, sans-serif;">
        <div class="row">
            <RouterLink class="back-to-admin" to="/admin">Admin >> {{t('edit_recipes')}}</RouterLink>
        </div>
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_recipes')}}</h1>
        </div>
        <div class="row my-2">  
            <div class="col-12">
                <div v-if="store.recipes.length == 0" class="d-flex justify-content-center">
                    <p style="font-weight: bold;color: red;">{{ t("no_data") }}</p>
                </div>
                <div class="d-flex justify-content-center">
                    <span v-if="store.recipes.length == 0" class="btn btn-success" v-on:click="addRecipe">
                        {{ t("add_new") }}
                    </span>
                </div>
                <div class="table-responsive">
                    <table class="admin-table" v-if="store.recipes.length > 0">
                    <thead>
                        <tr>
                            <th style="width: 10%;">
                                <span class="btn btn-success m-1" v-on:click="addRecipe">
                                    {{ t("add_new") }}
                                </span>
                            </th>
                            <th class="text-center" style="width: 1%;">Id</th>
                            <th class="text-center" style="width: 10%;">{{ t("name") }} (hu)</th>
                            <th class="text-center" style="width: 10%;">{{ t("name") }} (en)</th>
                            <th class="text-center" style="width: 5%;">{{ t("type") }}</th>
                            <th style="width: 10%;">{{ t("image") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(recipe,index) in useRecipesStore().recipes" :key="index">
                            <td>
                                <span class="btn btn-primary table-btn p-2 m-1"  v-on:click="editRecipe(recipe)">
                                    <i class="bi bi-pencil d-flex justify-content-center"></i>
                                </span>
                                <span class="btn btn-danger table-btn p-2" v-on:click="deleteRecipe(recipe)">
                                    <i class="bi bi-trash d-flex justify-content-center"></i>
                                </span>
                            </td>
                            <td class="text-center pt-3">{{ recipe.id }}</td>
                            <td class="text-center pt-3">{{ recipe.name }}</td>
                            <td class="text-center pt-3">{{ recipe.name_EN }}</td>
                            <td class="text-center pt-3">{{ recipe.type }}</td>
                            <td><img class="tdImage" v-bind:src="recipe.image"></img></td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <RecipeEditor :recipe="data" v-on:editor-closed="closeEditor" v-on:save-data="saveData" v-if="openEditor == true"/>
</template>

<style lang="css">

</style>