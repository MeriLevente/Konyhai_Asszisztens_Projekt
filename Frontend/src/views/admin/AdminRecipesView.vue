<script setup lang="ts">
    import Paginator from '@/components/Paginator.vue';
    import RecipeEditor from '@/components/recipes/RecipeEditor.vue';
    import Searchbar from '@/components/Searchbar.vue';
    import type IRecipe from '@/models/Recipe';
    import { useAppStore } from '@/stores/appstore';
    import { useRecipeStore } from '@/stores/recipestore';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useRecipeStore();
    let searchInAction = ref<boolean>(false);
    let openEditor = ref(false);
    let maxLength = ref<number>(Number(sessionStorage.getItem("recipesMaxLength")) ?? store.recipes.length);

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
        if (confirm(`${t("deleteYesNo")} ${useAppStore().app_language == "hu" ? selected.name : selected.name_EN}?`) == true)
            store.deleteRecipe(selected)
                .then(()=>{})
                .catch((err: string)=>{alert(err)});
    };

    const saveData = (recipe: IRecipe) => {
        store.saveRecipes(recipe)?.then(()=>closeEditor()).catch();
    };

    const closeEditor = () => {
        openEditor.value = false;
        data.value = null;
    };

    if (!sessionStorage.getItem("recipesMaxLength")) {
        store.getAllRecipesLength().then((res: number)=>{
            maxLength.value = res;
        });
    }

    const search = (searchedWord: string): void => {
        store.getRecipesBySearch(searchedWord).then(()=> searchInAction.value = true).catch((err: string)=>{alert(err)});
    };

    const loadRecipesPaginated = (paginatorValues: {from: number, to: number}): void => {
        store.loadRecipesPaginated(paginatorValues.from, paginatorValues.to).catch((err: string)=>{console.error(err)});
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
                <div class="row d-flex justify-content-center">
                    <Searchbar v-on:search="search" v-on:show-paginated="loadRecipesPaginated({from: 0, to: 6}); searchInAction = false" 
                        class="w-50" :viewer-role="'admin'" :searchInAction="searchInAction"/>
                </div>

                <div v-if="store.recipes.length == 0" class="nodata-div w-50 mx-auto p-3">
                    <h3 class="text-center">{{ t("no_data") }}</h3>
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
                        <tr v-for="(recipe,index) in useRecipeStore().recipes" :key="index">
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
        <Paginator :page="'admin_recipes'" v-if="!searchInAction" 
            :max-length="store.recipesAllLength" v-on:paginator-triggered="loadRecipesPaginated"/>
    </div>
    <RecipeEditor :recipe="data" v-on:editor-closed="closeEditor" v-on:save-data="saveData" v-if="openEditor == true"/>
</template>

<style lang="css">

</style>