<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { useRecipeStore } from '@/stores/recipestore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import Searchbar from './Searchbar.vue';
    import { useItemStore } from '@/stores/itemstore';
    import { useUserStore } from '@/stores/userstore';
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["headerTitle", "headerDescription"]);
    const emit = defineEmits(["showAll", "searchStoredItem", "typeChangedDisablePagi", "showNew"])
    let showAlltriggered = ref<boolean>(false);
    const selectedType = ref<string>(sessionStorage.getItem("selectedRecipeType") ?? "0");

    const search = (searchedWord: string): void => {
        if(props.headerTitle == "mykitchen"){
            emit("searchStoredItem", searchedWord);
        } else {
            selectedType.value = "0";
            emit("typeChangedDisablePagi", false);
            useRecipeStore().getRecipesBySearch(searchedWord).catch((err:string)=> alert(err));
        }
    };

    const showAll = (): void => {
        emit("showAll");
        if(props.headerTitle != "mykithcen"){
            emit("typeChangedDisablePagi", true);
            useRecipeStore().loadRecipesPaginated(0, 6);
        } else {
            useUserStore().selectedItemtype = 0;
        }
    };

    const recipeTypeChanged = (): void => {
        sessionStorage.setItem("selectedRecipeType", selectedType.value)
        if (selectedType.value != "0"){
            emit("typeChangedDisablePagi", false);
            useRecipeStore().getRecipesByType(selectedType.value);
        }
        else {
            emit("typeChangedDisablePagi", true);
            useRecipeStore().loadRecipesPaginated(0, 6);
        }   
    };

    const showNewPopUp = (): void => {
        emit("showNew");
    };
</script>

<template>
    <header class="row brown-header-div p-1">
        <h1 class="text-center mt-3 display-4 mb-0 header-h1">{{t(headerTitle)}}</h1>
        <p class="text-center mt-0 p-catchphrase">{{ t(headerDescription) }}</p>
        <div class="row filtering">
            <div class="col-6 col-md-3 d-flex justify-content-center" v-if="props.headerTitle == 'mykitchen'">
                <span class="my-score-span">{{ useItemStore().itemsAllLength }}/{{ useUserStore().storedItemsAllLength }}</span> 
                <button class="btn w-100" id="newItemBtn" v-on:click="showNewPopUp">
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
                <Searchbar v-on:search="search"/>
            </div>
            </div>
        </header>
</template>

<style lang="css">
    .my-score-span{
        background-color: greenyellow;
        color: black;
        border-radius: 10rem;
        padding-top: 3.8%;
        padding-left: 3%;
        padding-right: 3%;
        border: 2px solid var(--ebony-clay);
        height: 3.5rem;
        width: 3.5rem;
        margin-right: 1rem;
    }
</style>