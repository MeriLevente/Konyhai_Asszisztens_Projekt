<script setup lang="ts">
    import type IRecipe from '@/models/Recipe';
    import { useAdminStore } from '@/stores/adminstore';
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useAdminStore();

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
            type: "",
            difficulty: 0,
            time: 0,
            image: ""
        }
    };

    const editRecipe = (selected: IRecipe) => {
        data.value = {
            nameHU: selected.nameHU,
            nameEN: selected.nameEN,
            descriptionHU: selected.descriptionHU,
            descriptionEN: selected.descriptionEN,
            type: selected.type,
            difficulty: selected.difficulty,
            time: selected.time,
            image: selected.image
        }
    };

    const deleteRecipe = (selected: IRecipe) => {
        console.log(selected);
    };

    const saveData = (type: any) => {
        // storeban lévő saveRecipe vagy editRecipe => serviceben
        console.log(type.value);
        data.value = null;
    };
</script>

<template>
    <div class="container my-5 justify-center">
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_recipes')}}</h1>
        </div>
        <div class="row my-2">  
            <div class="col-12">
                <table class="table table-hover" v-if="recipes.length > 0">
                <thead>
                    <tr>
                        <th style="width: 10%;">
                            <span class="btn btn-success" v-on:click="addRecipe">
                                {{ t("add_new") }}
                            </span>
                        </th>
                        <th class="text-center" style="width: 1%;">Id</th>
                        <th class="text-center" style="width: 25%;">{{ t("name") }} (hu)</th>
                        <th class="text-center" style="width: 25%;">{{ t("name") }} (en)</th>
                        <th class="text-center" style="width: 15%;">{{ t("type") }}</th>
                        <th class="text-center" style="width: 8%;">{{ t("difficulty") }}</th>
                        <th class="text-center" style="width: 8%;">{{ t("time") }}</th>
                        <th style="width: 20%;">{{ t("image") }}</th>
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
                        <td class="text-center pt-3">{{ recipe.difficulty }}</td>
                        <td class="text-center pt-3">{{ recipe.time }}</td>
                        <td><img class="tdImage" v-bind:src="recipe.image"></img></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
</template>

<style lang="css">

</style>