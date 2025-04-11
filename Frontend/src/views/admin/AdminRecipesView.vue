<script setup lang="ts">
    import Paginator from '@/components/Paginator.vue';
    import RecipeEditor from '@/components/recipes/RecipeEditor.vue';
    import Searchbar from '@/components/Searchbar.vue';
    import type IRecipe from '@/models/Recipe';
    import { useAppStore } from '@/stores/appstore';
    import { useRecipeStore } from '@/stores/recipestore';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useRecipeStore();
    let searchInAction = ref<boolean>(false);
    let openEditor = ref(false);
    let maxLength = ref<number>(Number(sessionStorage.getItem("recipesMaxLength")) ?? store.recipes.length);
    let loading = ref<boolean>(false);
    let data = ref<IRecipe | null>();

    onMounted((): void => {
        if (!sessionStorage.getItem("recipesMaxLength")) {
            store.getAllRecipesLength().then((res: number): void => {
                maxLength.value = res;
            });
        };
    });

    const addRecipe = (): void => {
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

    const editRecipe = (selected: IRecipe): void => {
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

    const deleteRecipe = (selected: IRecipe): void => {
        if (confirm(`${t("deleteYesNo")} ${useAppStore().appLanguage == "hu" ? selected.name : selected.name_EN}?`) == true)
            store.deleteRecipe(selected)
                .catch((err: string): void => {
                    alert(err);
                });
    };

    const saveData = (recipe: IRecipe): void => {
        store.saveRecipes(recipe)!
            .then((): void => closeEditor())
            .catch(()=> {});
    };

    const closeEditor = (): void => {
        openEditor.value = false;
        data.value = null;
    };

    const search = (searchedWord: string): void => {
        loading.value = true;
        store.getRecipesBySearch(searchedWord)
            .then((): void => {
                searchInAction.value = true;
                loading.value = false;
            })
            .catch((err: string): void => {
                alert(err);
                loading.value = false;
            });
    };

    const loadRecipesPaginated = (paginatorValues: {from: number, to: number}): void => {
        loading.value = true;
        store.loadRecipesPaginated(paginatorValues.from, paginatorValues.to)
            .then((): void => {
                loading.value = false;
            })
            .catch((err: string): void => {
                console.error(err);
                loading.value = false
            });
    };
</script>

<template>
    <main class="container my-5" v-if="openEditor == false">
        <div class="row">
            <RouterLink class="back-to-admin" to="/admin" data-cy="back-button">Admin >> {{t('edit_recipes')}}</RouterLink>
        </div>
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_recipes')}}</h1>
        </div>
        <div class="row d-flex justify-content-center">
            <Searchbar v-on:search="search" v-on:show-paginated="loadRecipesPaginated({from: 0, to: 6}); searchInAction = false" 
                class="w-50" :viewer-role="'admin'" :searchInAction="searchInAction"/>
        </div>
        <div class="row my-5 d-flex justify-content-center" v-if="loading">
            <span class="spinner-border spinner-border-bg text-center"></span>
        </div>
        <div class="row my-2" v-if="!loading">  
            <div class="col-12">
                <div v-if="store.recipes.length == 0" class="nodata-div w-50 mx-auto p-3" data-cy="no-data">
                    <h3 class="text-center">{{ t("no_data") }}</h3>
                </div>
                <div class="table-responsive">
                    <table class="admin-table" v-if="store.recipes.length > 0">
                        <thead>
                            <tr>
                                <th style="width: 10%;">
                                    <span class="btn btn-success m-1" v-on:click="addRecipe" data-cy="add-button">
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
                            <tr v-for="(recipe,index) in useRecipeStore().recipes" :key="index" data-cy="data-tr">
                                <td>
                                    <span class="btn btn-primary table-btn p-2 m-1"  v-on:click="editRecipe(recipe)" data-cy="edit-button">
                                        <i class="bi bi-pencil d-flex justify-content-center"></i>
                                    </span>
                                    <span class="btn btn-danger table-btn p-2" v-on:click="deleteRecipe(recipe)" data-cy="delete-button">
                                        <i class="bi bi-trash d-flex justify-content-center"></i>
                                    </span>
                                </td>
                                <td class="text-center pt-3">{{ recipe.id }}</td>
                                <td class="text-center pt-3">{{ recipe.name }}</td>
                                <td class="text-center pt-3">{{ recipe.name_EN }}</td>
                                <td class="text-center pt-3">{{ recipe.type }}</td>
                                <td><img class="td-image" v-bind:src="recipe.image"></img></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <Paginator :page="'admin_recipes'" v-if="!searchInAction" 
            :max-length="store.recipesAllLength" v-on:paginator-triggered="loadRecipesPaginated"/>
    </main>
    <RecipeEditor :recipe="data" v-on:editor-closed="closeEditor" v-on:save-data="saveData" v-if="openEditor == true"/>
</template>

<style lang="css"/>