<script setup lang="ts">
    import RecipeEditor from '@/components/RecipeEditor.vue';
import type IRecipe from '@/models/Recipe';
    import { useAdminStore } from '@/stores/adminstore';
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useAdminStore();
    let openEditor = ref(false);

    const recipes = computed((): IRecipe[] => {
        return store.storeRecipes
    });

    let data = ref<IRecipe | null>();

    const addRecipe = () => {
        data.value = {
            nameHU: "",
            nameEN: "",
            descriptionHU: "",
            descriptionEN: "",
            type: "AME",
            difficulty: 0,
            time: 0,
            image: ""
        };
        openEditor.value = true;
    };

    const editRecipe = (selected: IRecipe) => {
        data.value = {
            id: selected.id,
            nameHU: selected.nameHU,
            nameEN: selected.nameEN,
            descriptionHU: selected.descriptionHU,
            descriptionEN: selected.descriptionEN,
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
    <div class="container my-5 justify-center" v-if="openEditor == false">
        <div class="row">
            <RouterLink class="back-to-admin" to="/admin">Admin >> {{t('edit_recipes')}}</RouterLink>
        </div>
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_recipes')}}</h1>
        </div>
        <div class="row my-2">  
            <div class="col-12">
                <div v-if="recipes.length == 0" class="d-flex justify-content-center">
                    <p style="font-weight: bold;color: red;">{{ t("no_data") }}</p>
                </div>
                <div class="d-flex justify-content-center">
                    <span v-if="recipes.length == 0" class="btn btn-success" v-on:click="addRecipe">
                        {{ t("add_new") }}
                    </span>
                </div>
                <div class="table-responsive">
                    <table class="admin-table" v-if="recipes.length > 0">
                    <thead>
                        <tr>
                            <th style="width: 8%;">
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
                        <tr v-for="(recipe,index) in recipes" :key="index">
                            <td>
                                <span class="btn btn-primary p-2 m-1"  v-on:click="editRecipe(recipe)"><i class="bi bi-pencil"></i></span>
                                <span class="btn btn-danger p-2" v-on:click="deleteRecipe(recipe)"><i class="bi bi-trash"></i></span>
                            </td>
                            <td class="text-center pt-3">{{ recipe.id }}</td>
                            <td class="text-center pt-3">{{ recipe.nameHU }}</td>
                            <td class="text-center pt-3">{{ recipe.nameEN }}</td>
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