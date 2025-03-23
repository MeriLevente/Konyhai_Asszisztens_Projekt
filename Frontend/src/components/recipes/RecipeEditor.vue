<script setup lang="ts">
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useAdminStore } from '@/stores/adminstore';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from '@/stores/appstore';
    import type Item from '@/models/Item';
    import type Ingredient from '@/models/Ingredient';
    import RecipeValidation from '@/utils/RecipeValidation';
    import type IFormResponse from '@/models/FormResponse';
    import DataLoader from '@/utils/DataLoader';
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
    const emit = defineEmits(["editorClosed", "saveData"]);
    const { recipe_types, recipes_error } = storeToRefs(useAdminStore());
    const { app_language } = storeToRefs(useAppStore());

    const selectedStep = ref("1");
    const selectedLanguage = ref("hu");

    let selectedTypeId = ref<number | null>();
    let ingredients = ref<Ingredient[]>(props.recipe.ingredients ?? []);
    let selectedIngredient = ref<Item | null>();
    let ingredientQuantity = ref<number | null>();
    let ingrInputError = ref<string | undefined>("");

    let descHU = ref<string[]>(props.recipe.description == "" ? [] : props.recipe.description.split("#"));
    let descEN = ref<string[]>(props.recipe.description_EN == "" ? [] : props.recipe.description_EN.split("#"));
    let stepInput = ref<string>("");
    let stepInputError = ref<string | undefined>("");

    // let imageToSave: string | undefined = props.recipe.image;

    const resetRecipeError = (): void => {
        recipes_error.value.en = '';
        recipes_error.value.hu = '';
    };

    const closeEditor = () => {
        resetRecipeError();
        emit("editorClosed");
    };

    const imageChanged = (event: any) => {
        // imageToSave = useAdminStore().imageChange(event.target.files[0])
    };

    const saveIngredient = (): void => {
        ingrInputError.value = '';
        if(ingredients.value.length < 20){
            let ingredient: Ingredient;
            const validation = RecipeValidation.IngredientInputCorrect(selectedTypeId.value!, selectedIngredient.value!, ingredientQuantity.value!);
            if(!validation.isError){
                ingredient = {
                    recipeId: props.recipe.id,
                    item: selectedIngredient.value!,
                    quantity: ingredientQuantity.value!
                }
                const ingrContains = ingredients.value.find(x=> x.item.itemId == ingredient.item.itemId);
                if(ingrContains)
                    ingredients.value.forEach(x=> {
                        if(x.item.itemId == ingrContains.item.itemId){
                            x.quantity += ingredient.quantity;
                        }
                    })
                else
                    ingredients.value.push(ingredient);

                ingrInputError.value = '';
                selectedTypeId.value = null;
                selectedIngredient.value = null;
                ingredientQuantity.value = null;
                resetRecipeError();
            } else {
                ingrInputError.value = app_language.value == 'hu' ? validation.message : validation.messageEn;
            }
        } else {
            ingrInputError.value = app_language.value == 'hu' ? 'Maximum 20 elemet vehet fel!' : 'The maximum ingredient count is 20!';
        }
    };

    const deleteIngredient = (index: number): void => {
        ingredients.value = ingredients.value.filter(x=> x.item.itemId != index);
    };

    const saveStep = (): void => {
        const stepNmbValidation: IFormResponse = stepNumberIsCorrect();
        if(stepNmbValidation.isError){
            stepInputError.value =  app_language.value == 'hu' ? stepNmbValidation.message : stepNmbValidation.messageEn;
            return;
        }
        stepInputError.value = "";
        const validation = RecipeValidation.RecipeStepIsCorrect(stepInput.value!);
        if(!validation.isError){
            const stepIndex: number = Number(selectedStep.value)-1;
            if(selectedLanguage.value == "hu"){
                descHU.value[stepIndex] = stepInput.value!;
            }
            if(selectedLanguage.value == "en")
                descEN.value[stepIndex] = stepInput.value!;
            if(stepIndex != 3){
                selectedStep.value = `${stepIndex+2}`;
            }
            stepInput.value = "";
            stepInputError.value = "";
        } else {
            stepInputError.value = app_language.value == 'hu' ? validation.message : validation.messageEn;
        }
    };

    const stepNumberIsCorrect = (): IFormResponse => {
        const maxStepNmb = app_language.value == 'hu' ? descHU.value.length+1 : descEN.value.length+1;
        if(Number(selectedStep.value) <= 0 || Number(selectedStep.value) > Number(maxStepNmb)){
            return {message: "Érvénytelen lépés szám!", messageEn: "Invalid step number!", isError: true};
        } else {
            return {isError: false};
        }
    }

    const submitRecipe = (): void => {
        props.recipe.description = descHU.value.join("#");
        props.recipe.description_EN = descEN.value.join("#");
        props.recipe.ingredients = ingredients.value;
        //props.recipe.image = imageToSave;
        resetRecipeError();
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
                    <input type="text" class="form-control m-1" id="nameHU" v-model="recipe.name" v-on:focus="resetRecipeError()">
                    <label for="difficulty" class="form-label">{{ t("difficulty") }}</label>
                    <input type="number" class="form-control m-1" id="difficulty" v-model="recipe.difficulty" placeholder="min: 1, max: 10" v-on:focus="resetRecipeError()">
                    <label for="image" class="form-label">{{ t("image") }}</label>
                    <input type="file" class="form-control" id="image" accept="images/*,.png,.jpg,.jpeg,.svg" v-on:change="imageChanged" v-on:focus="resetRecipeError()">
                </div>
                <div class="col-12 col-md-6 mb">
                    <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                    <input type="text" class="form-control m-1" id="nameEN" v-model="recipe.name_EN" v-on:focus="resetRecipeError()">
                    <label for="time" class="form-label">{{ t("time") }}</label>
                    <input type="number" class="form-control m-1" id="time" v-model="recipe.time" placeholder="min: 1, max: 10080" v-on:focus="resetRecipeError()">
                    <label for="type" class="form-label">{{ t("type") }}</label>
                    <select name="type" id="type" class="form-control m-1" v-model="recipe.type">
                        <option v-for="type in recipe_types.types" :value="type.short"
                            :selected="recipe.type == type.short">{{ app_language == "hu" ? type.hu : type.en  }}
                        </option>
                    </select>
                </div>
            </div>

            <hr> <!-- HOZZÁVALÓK -->
            <div class="row p-2">
                <h5 class="text-center">{{ t("ingredients") }}</h5>
                <div class="col-12 col-md-6 InputDiv mb-2 p-2">
                    <label for="itemtype">{{ t('type') }}</label>
                    <select id="itemtype" name="itemtype"
                        v-model="selectedTypeId" class="form-control"
                        v-on:click="DataLoader.loadTypes(); useAdminStore().getItemsByTypeId(selectedTypeId!)"
                    >
                        <option v-for="type in useAdminStore().types" :value="type.id">
                            {{ app_language == 'hu' ? type.name : type.name_EN }}
                        </option>
                     </select>
                     <label for="ingredient">{{ t('ingredients') }}</label>
                     <select id="ingredient" class="form-control"
                        v-model="selectedIngredient" v-bind:disabled="selectedTypeId == null">
                        <option v-for="ingr in useAdminStore().items" :value="ingr">{{app_language == 'hu' ? ingr.name : ingr.name_EN}}</option>
                     </select>

                     <div class="row">
                        <div class="col-8">
                            <label for="quantity">{{ t("quantity") }}</label>
                            <input type="number" min="1" max="10000" class="form-control" v-model="ingredientQuantity"/>
                        </div>
                        <div class="col-4 py-4">
                            <span class="unitSpan" v-if="selectedIngredient">{{ t(selectedIngredient!.unit) }}</span>
                        </div>
                     </div>
                     <p class="text-danger d-flex justify-content-center my-2">{{ ingrInputError }}</p>
                     <div class="d-flex justify-content-center" v-on:click="saveIngredient">
                        <button class="btn btn-success" type="button">{{ t("save") }}</button>
                     </div>
                </div>
                <div class="col-12 col-md-6" style="display: flex; float: left; flex-wrap: wrap;">
                    <div v-for="(ingr,index) in ingredients" :key="index" class="ingredient-div d-flex align-items-start">
                        <i class="bi bi-trash" v-on:click="deleteIngredient(ingr.item.itemId!)"></i>
                        <div>
                            {{ `${app_language == 'hu' ? ingr.item.name : ingr.item.name_EN}`}}
                            <br>
                            {{ `${ingr.quantity} ${ingr.item.unit}` }}
                        </div>
                    </div>
                </div>
            </div>

            <hr>
            <div class="row p-2">
                <div class="col-12 col-md-6">
                    <h5>{{ t("input_step") }}</h5>
                    <p>{{ t("input_step_rules") }}</p>

                    <div class="row InputDiv p-3 mb-2">
                        <div class="row mb-2">
                            <div class="col-6">
                                <label for="step" class="form-label">{{ t("language") }}</label>
                                <select name="language" id="lang" class="form-control" v-model="selectedLanguage"
                                    v-on:change="{
                                        selectedStep = '1';
                                        stepInputError = '';
                                    }">
                                    <option value="hu">{{ t("hu") }}</option>
                                    <option value="en">{{ t("en") }}</option>
                                </select>
                            </div>
                            <div class="col-4">
                                <label for="step" class="form-label">{{ t("step") }}</label>
                                <input v-if="selectedLanguage == 'hu'" type="number" name="step" id="step"
                                   class="form-control" min="1" :max="descHU.length == 4 ? '4' : descHU.length+1" v-model="selectedStep">
                                <input v-if="selectedLanguage == 'en'" type="number" name="step" id="stepEn"
                                    class="form-control" min="1" :max="descEN.length == 4 ? '4' : descEN.length+1" v-model="selectedStep">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <label for="desc" class="form-label">{{ t("step") }}</label>
                                <textarea id="desc" class="form-control"
                                v-model="stepInput"
                                maxlength="200" :placeholder="app_language == 'hu' ? 'max 200 karakter' : 'max 200 charachter'"
                                ></textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <span class="text-danger d-flex justify-content-center my-2" v-if="stepInputError">{{ stepInputError }}</span>
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
                {{ app_language == 'hu' ? recipes_error.hu : recipes_error.en }}
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

<style lang="css" scoped src="@/assets/css/recipeeditor.css"></style>