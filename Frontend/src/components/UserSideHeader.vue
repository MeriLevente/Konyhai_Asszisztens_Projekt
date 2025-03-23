<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { useRecipeStore } from '@/stores/recipestore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["headerTitle", "headerDescription"]);
    const emit = defineEmits(["showAll", "searchStoredItem"])
    const searchedWord = ref<string>();
    let showAlltriggered = ref<boolean>(false);
    const selectedType = ref<string>(sessionStorage.getItem("selectedRecipeType") ?? "0");

    const search = (): void => {
        if(props.headerTitle == "mykitchen"){
            emit("searchStoredItem", searchedWord.value);
        } else {
            selectedType.value = "0";
            useRecipeStore().getRecipesBySearch(searchedWord.value!);
        }
    };

    const showAll = (): void => {
        emit("showAll");
    };

    const recipeTypeChanged = (): void => {
        sessionStorage.setItem("selectedRecipeType", selectedType.value)
        if (selectedType.value != "0")
            useRecipeStore().getRecipesByType(selectedType.value);
        else
            useRecipeStore().getRecipes();
    };
</script>

<template>
    <header class="row brown-header-div p-1">
        <h1 class="text-center mt-3 display-4 mb-0 header-h1">{{t(headerTitle)}}</h1>
        <p class="text-center mt-0 p-catchphrase">{{ t(headerDescription) }}</p>
        <div class="row filtering">
            <div class="col-6 col-md-3 d-flex justify-content-center" v-if="props.headerTitle == 'mykitchen'">
                <button class="btn w-100" id="newItemBtn">
                    <span style="font-size: 1.2rem;">{{ t("add_new") }}</span>
                </button>  
            </div>
            <div class="col-5 col-md-2 form-floating p-1 ms-1" v-if="props.headerTitle == 'recipesTitle'">
                    <select class="form-control input-area" id="typeselect" v-on:change="recipeTypeChanged()" v-model="selectedType">
                        <option value="0">{{ t("all") }}</option>
                        <option v-for="type in useRecipeStore().recipe_types" :value="type.short">
                            {{ app_language == 'hu' ? type.hu : type.en }}
                        </option>
                    </select>
                    <label for="typeselect">{{t("type")}}</label>
            </div>  
            <div class="col-6 col-md-3 pt-4">
                <input type="checkbox" class="ms-1 mt-2" style="float: right;" v-on:change="showAll()" :checked="showAlltriggered">
                <label style="font-size: 1.2rem; float: right;">{{ t("showAll") }}</label>
            </div>
            <div class="col-12 col-md-6">
                <form @submit.prevent="search()">
                    <div class="form-floating input-area">
                        <input type="text" name="search" id="search" class="form-control" v-model="searchedWord">
                            <button type="submit" class="search-icon" style="display: inline;">
                                <span class="bi bi-search"></span>
                            </button>
                        </input>
                        <label for="search">{{ t("search") }}</label>
                    </div>
                </form>
            </div>
            </div>
        </header>
</template>

<style lang="css">
    
</style>