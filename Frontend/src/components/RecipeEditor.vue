<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useAdminStore } from '@/stores/adminstore';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from '@/stores/appstore';
    import type Item from '@/models/Item';
    import type Ingredient from '@/models/Ingredient';
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
    const emit = defineEmits(["editorClosed", "saveData"]);
    const { recipe_types, recipes_error } = storeToRefs(useAdminStore());
    const { app_language } = storeToRefs(useAppStore());

    const selectedStep = ref("1");
    const selectedLanguage = ref("hu");

    let selectedTypeId = ref<number>();
    let ingredients = ref<Ingredient[]>(props.recipe.ingredients ?? []);
    let selectedIngredient = ref<Item>();
    let ingredientQuantity = ref<number>();

    let descHU = ref<string[]>(props.recipe.descriptionHU == "" ? [] : props.recipe.descriptionHU.split("#"));
    let descEN = ref<string[]>(props.recipe.descriptionEN == "" ? [] : props.recipe.descriptionEN.split("#"));
    let stepInput = ref<string>();

    const closeEditor = () => {
        emit("editorClosed");
    };

    const saveIngredient = (): void => {
        if(ingredients.value.length < 20){
            let ingredient: Ingredient;
            if(selectedIngredient.value && ingredientQuantity.value){
                ingredient = {
                    recipe_id: props.recipe.id,
                    item: selectedIngredient.value!,
                    quantity: ingredientQuantity.value!
                }
                const ingrContains = ingredients.value.find(x=> x.item.id == ingredient.item.id);
                if(ingrContains)
                    ingredients.value.forEach(x=> {
                        if(x.item.id == ingrContains.item.id){
                            x.quantity += ingredient.quantity
                        }
                    })
                else
                    ingredients.value.push(ingredient)
            }
        }
    };

    const deleteIngredient = (index: number): void => {
        ingredients.value = ingredients.value.filter(x=> x.item.id != index);
    }

    const saveStep = (): void => {
        if(stepInput.value != "" ){
            const stepIndex: number = Number(selectedStep.value)-1;
            if(selectedLanguage.value == "hu"){
                descHU.value[stepIndex] = stepInput.value!
            }  
            if(selectedLanguage.value == "en")
                descEN.value[stepIndex] = stepInput.value!
            if(stepIndex != 3){
                selectedStep.value = `${stepIndex+2}`
            }
            stepInput.value = "";
        }
    };

    const submitRecipe = (): void => {
        props.recipe.descriptionHU = descHU.value.join("#");
        props.recipe.descriptionEN = descEN.value.join("#");
        props.recipe.ingredients = ingredients.value;
        console.log(props.recipe)
        emit("saveData", props.recipe);
    };
</script>

<template>
    <div class="content-box my-5 mx-3">
        <div class="container">
        <form @submit.prevent="submitRecipe()">
            <h1 class="text-center">{{ t("recipe_editor") }}</h1>
            <div class="row mb-2">
                <div class="col-12 col-md-6">
                    <label for="nameHU" class="form-label">{{ t("name") }} (hu)</label>
                    <input type="text" class="form-control m-1" id="nameHU" v-model="recipe.nameHU" >
                    <label for="difficulty" class="form-label">{{ t("difficulty") }}</label>
                    <input type="number" class="form-control m-1" id="difficulty" v-model="recipe.difficulty" placeholder="min: 1, max: 10">
                    <label for="image" class="form-label">{{ t("image") }}</label>
                    <input type="text" class="form-control m-1" id="image" v-model="recipe.image">
                </div>
                <div class="col-12 col-md-6 mb">
                    <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                    <input type="text" class="form-control m-1" id="nameEN" v-model="recipe.nameEN">
                    <label for="time" class="form-label">{{ t("time") }}</label>
                    <input type="number" class="form-control m-1" id="time" v-model="recipe.time" placeholder="min: 1, max: 10080">
                    <label for="type" class="form-label">{{ t("type") }}</label>
                    <select name="type" id="type" class="form-control m-1" v-model="recipe.type">
                        <option v-for="type in recipe_types.types" :value="type.short" 
                            :selected="recipe.type == type.short">{{ app_language.lang == "hu" ? type.hu : type.en  }}
                        </option>
                    </select>
                </div>
            </div>

            <hr> <!-- HOZZÁVALÓK -->
            <div class="row p-2">
                <h5 class="text-center">{{ t("ingredients") }}</h5>
                <div class="col-12 col-md-6">
                    <!-- két select => típus és a típushoz tartozó itemek + a mennyiség megadása + felvétel gomb-->
                     <label for="itemtype">{{ t('type') }}</label>
                     <select id="itemtype" name="itemtype" v-model="selectedTypeId" class="form-control">
                        <option v-for="type in useAdminStore().storeTypes" :value="type.id">
                            {{ app_language.lang == 'hu' ? type.nameHU : type.nameEN }}
                        </option>
                     </select>
                     <label for="ingredient">{{ t('ingredients') }}</label>
                     <select id="ingredient" class="form-control" v-model="selectedIngredient">
                        <option v-for="ingr in useAdminStore().storeItems" :value="ingr">{{app_language.lang == 'hu' ? ingr.nameHU : ingr.nameEN}}</option>
                     </select>
                     
                     <div class="row">
                        <div class="col-10">
                            <label for="quantity">{{ t("quantity") }}</label>
                            <input type="number" min="0" max="200000" class="form-control" v-model="ingredientQuantity"/>
                        </div>
                        <div class="col-2 pt-4">
                            <span v-if="selectedIngredient">{{ t(selectedIngredient!.unit) }}</span>
                        </div>
                     </div>
                     <div class="d-flex justify-content-center" v-on:click="saveIngredient">
                        <button class="btn btn-success" type="button">{{ t("save") }}</button>
                     </div>
                </div>
                <div class="col-12 col-md-6" style="display: flex; float: left; flex-wrap: wrap;">
                    <div v-for="(ingr,index) in ingredients" :key="index" class="ingredient-div d-flex justify-content-center">
                        <i class="bi bi-trash" v-on:click="deleteIngredient(ingr.item.id!)"></i>
                        {{ `${index+1}. ${app_language.lang == 'hu' ? ingr.item.nameHU : ingr.item.nameEN}, ${ingr.quantity} ${ingr.item.unit}`}}
                    </div>
                </div>
            </div>

            <hr>
            <div class="row p-2">
                <div class="col-12 col-md-6">
                    <h5>{{ t("input_step") }}</h5>
                    <p>{{ t("input_step_rules") }}</p>
                    
                    <div class="row stepInputDiv p-3">
                        <div class="row mb-2">
                            <div class="col-6">
                                <label for="step" class="form-label">{{ t("language") }}</label>
                                <select name="language" id="lang" class="form-control" v-model="selectedLanguage" v-on:change="selectedStep = '1'">
                                    <option value="hu">{{ t("hu") }}</option>
                                    <option value="en">{{ t("en") }}</option>
                                </select>
                            </div>
                            <div class="col-4">
                                <label for="step" class="form-label">{{ t("step") }}</label>
                                <input v-if="selectedLanguage == 'hu'" type="number" name="step" id="step" 
                                   class="form-control" min="1" :max="descHU.length == 4 ? '4' : descHU.length+1" v-model="selectedStep">
                                <input v-if="selectedLanguage == 'en'" type="number" name="step" id="step" 
                                    class="form-control" min="1" :max="descEN.length == 4 ? '4' : descEN.length+1" v-model="selectedStep">
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-12">
                                <label for="desc" class="form-label">{{ t("step") }}</label>
                                <textarea id="desc" class="form-control"
                                v-model="stepInput"
                                maxlength="200" :placeholder="app_language.lang == 'hu' ? 'max 200 karakter' : 'max 200 charachter'"
                                ></textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4 offset-5">
                                <button type="button" class="btn btn-success" v-on:click="saveStep">{{ t("save") }}</button>
                            </div>
                        </div>
                    </div>     
                </div>
                <div class="col-12 col-md-6">
                    <h5>{{ t("steps") }}</h5>
                    <p>-- {{ selectedLanguage == 'hu' ? t("hu") : t("en") }} --</p>
                    <p v-if="descHU[0] != '' && selectedLanguage == 'hu'" v-for="(step, index) in descHU">{{ `${index+1}. ${step}` }}</p>
                    <p v-if="descEN[0] != '' && selectedLanguage == 'en'" v-for="(step, index) in descEN">{{ `${index+1}. ${step}` }}</p>
                </div>
            </div>
            <div v-if="recipes_error.hu != '' && recipes_error.en != ''" class="text-danger text-center mx-5 mb-2">
                {{ app_language.lang == 'hu' ? recipes_error.hu : recipes_error.en }}
            </div>
            <div class="row m-3">
                <div class="col d-flex justify-content-end">
                    <button type="button" class="btn btn-danger" v-on:click="closeEditor">{{ t("cancel") }}</button>
                </div>
                <div class="col">
                    <button type="submit" class="btn btn-success">{{ t("save") }}</button>
                </div>
            </div>
        </form>
        </div> 
    </div>
</template>

<style lang="css" scoped>
    .content-box {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container{
        background-color: var(--mercury);
        border: 3px solid var(--ebony-clay);
        border-radius: 5px;
    }
    .stepInputDiv{
        border: 0.5px solid gray;
        border-radius: 5px;
    }
    textarea{
        height: 12vh;
        resize: none;
    }
    .ingredient-div{
        border: 0.5px var(--ebony-clay) solid;
        border-radius: 20px;
        height: 3rem;
        width: 10rem;
        background-color: var(--mercury);
        color: var(--ebony-clay);
        font-weight: bold;
        align-content: center;
    }
    i{
        width: 2.5rem;
        height: 2.5rem;
        cursor: pointer;
        align-content: center;
    }
</style>