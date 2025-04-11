<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from '@/stores/appstore';
    import type Item from '@/models/Item';
    import type Ingredient from '@/models/Ingredient';
    import RecipeValidation from '@/utils/RecipeValidation';
    import type IFormResponse from '@/models/FormResponse';
    import { useRecipeStore } from '@/stores/recipestore';
    import { useItemStore } from '@/stores/itemstore';
    import { useTypeStore } from '@/stores/typestore';
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
    const emit = defineEmits(["editorClosed", "saveData"]);
    const { recipeTypes, recipesError } = storeToRefs(useRecipeStore());
    const { appLanguage } = storeToRefs(useAppStore());

    const selectedStep = ref<string>("1");
    const selectedLanguage = ref<string>("hu");
    const selectedTypeId = ref<number | null>();
    const ingredients = ref<Ingredient[]>(props.recipe.ingredients ?? []);
    const selectedIngredient = ref<Item | null>();
    const ingredientQuantity = ref<number | null>();
    const ingrInputError = ref<IFormResponse>({message: '', messageEn: ''});
    const descHU = ref<string[]>(props.recipe.description == "" ? [] : props.recipe.description.split("#"));
    const descEN = ref<string[]>(props.recipe.description_EN == "" ? [] : props.recipe.description_EN.split("#"));
    const stepInput = ref<string>("");
    const stepInputError = ref<string | undefined>("");

    onMounted((): void => {
        useTypeStore().getTypes();
    });

    const resetRecipeError = (): void => {
        recipesError.value.hu = '';
        recipesError.value.en = '';
    };

    const closeEditor = (): void => {
        resetRecipeError();
        emit("editorClosed");
    };

    const hideIngredientError = (): void => {
        ingrInputError.value!.message = '';
        ingrInputError.value!.messageEn = '';
    };

    const saveIngredient = (): void => {
        hideIngredientError();
        if (ingredients.value.length < 10) {
            let ingredient: Ingredient;
            const validation = RecipeValidation.ingredientInputCorrect(
                selectedTypeId.value!, selectedIngredient.value!, ingredientQuantity.value!
            );
            if (!validation.isError) {
                ingredient = {
                    recipeId: props.recipe.id,
                    item: selectedIngredient.value!,
                    quantity: ingredientQuantity.value!
                };
                const ingrContains = ingredients.value.find(x=> x.item.id == ingredient.item.id);
                if (ingrContains)
                    ingredients.value.forEach(x => {
                        if(x.item.id == ingrContains.item.id){
                            x.quantity += ingredient.quantity;
                        };
                    });
                else
                    ingredients.value.push(ingredient);

                hideIngredientError();
                selectedTypeId.value = selectedIngredient.value = ingredientQuantity.value = null;
                resetRecipeError();
            } else {
                ingrInputError.value!.message = validation.message;
                ingrInputError.value!.messageEn = validation.messageEn;
            }
        } else {
            ingrInputError.value!.message = 'Maximum 10 elemet vehet fel!';
            ingrInputError.value!.messageEn = 'The maximum ingredient count is 10!';
        }
    };

    const deleteIngredient = (index: number): void => {
        ingredients.value = ingredients.value.filter(x=> x.item.id != index);
    };

    const saveStep = (): void => {
        const stepNmbValidation: IFormResponse = stepNumberIsCorrect();
        if (stepNmbValidation.isError) {
            stepInputError.value =  appLanguage.value == 'hu' ? stepNmbValidation.message : stepNmbValidation.messageEn;
            return;
        };
        stepInputError.value = "";
        const validation = RecipeValidation.recipeStepIsCorrect(stepInput.value!);
        if(!validation.isError){
            const stepIndex: number = Number(selectedStep.value) - 1;
            if (selectedLanguage.value == "hu")
                descHU.value[stepIndex] = stepInput.value!;
            if (selectedLanguage.value == "en")
                descEN.value[stepIndex] = stepInput.value!;
            if (stepIndex != 3)
                selectedStep.value = `${stepIndex+2}`;
            stepInput.value = "";
            stepInputError.value = "";
        } else {
            stepInputError.value = appLanguage.value == 'hu' ? validation.message : validation.messageEn;
        }
    };

    const stepNumberIsCorrect = (): IFormResponse => {
        const maxStepNmb = selectedLanguage.value == 'hu' ? descHU.value.length + 1 : descEN.value.length + 1;
        if (Number(selectedStep.value) <= 0 || Number(selectedStep.value) > Number(maxStepNmb) || Number(selectedStep.value) > 4) {
            return {message: "Érvénytelen lépés szám!", messageEn: "Invalid step number!", isError: true};
        } else {
            return {isError: false};
        };
    };

    const submitRecipe = (): void => {
        props.recipe.description = descHU.value.join("#");
        props.recipe.description_EN = descEN.value.join("#");
        props.recipe.ingredients = ingredients.value;
        resetRecipeError();
        emit("saveData", props.recipe);
    };
</script>

<template>
    <main class="content-box my-5 mx-3">
        <div class="container" data-cy="recipe-editor">
        <form @submit.prevent="submitRecipe()">
            <h1 class="text-center">{{ t("recipe_editor") }}</h1>
            <div class="row mb-2">
                <div class="col-12 col-md-6">
                    <label for="nameHU" class="form-label">{{ t("name") }} (hu)</label>
                    <input type="text" class="form-control m-1" id="nameHU" v-model="recipe.name" v-on:focus="resetRecipeError()" data-cy='name-input'>
                    <label for="difficulty" class="form-label">{{ t("difficulty") }}</label>
                    <input type="number" class="form-control m-1" id="difficulty" v-model="recipe.difficulty" min="1" max="10"
                        placeholder="min: 1, max: 10" v-on:focus="resetRecipeError()" data-cy='diff-input'>
                    <label for="image" class="form-label">{{ t("image") + " Url" }}</label>
                    <input type="text" class="form-control" id="image" v-model="recipe.image"
                            v-on:focus="() => {if(recipesError) resetRecipeError()}" data-cy='image-input'>
                </div>
                <div class="col-12 col-md-6 mb">
                    <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                    <input type="text" class="form-control m-1" id="nameEN" v-model="recipe.name_EN" v-on:focus="resetRecipeError()" data-cy='name-en-input'>
                    <label for="time" class="form-label">{{ t("time") }}</label>
                    <input type="number" class="form-control m-1" id="time" min="1" max="10080"
                        v-model="recipe.time" placeholder="min: 1, max: 10080" v-on:focus="resetRecipeError()" data-cy='time-input'>
                    <label for="type" class="form-label">{{ t("type") }}</label>
                    <select name="type" id="type" class="form-control m-1" v-model="recipe.type" data-cy='type-select'>
                        <option v-for="type in recipeTypes" :value="type.short"
                            :selected="recipe.type == type.short">{{ appLanguage == "hu" ? type.hu : type.en  }}
                        </option>
                    </select>
                </div>
            </div>
            <hr>
            <div class="row p-2">
                <h5 class="text-center">{{ t("ingredients") }}</h5>
                <div class="col-12 col-md-6 input-div mb-2 p-2">
                    <label for="itemtype">{{ t('type') }}</label>
                    <select id="itemtype" name="itemtype" v-model="selectedTypeId" class="form-control" 
                        v-on:change="selectedIngredient = null" v-on:focus="hideIngredientError()" data-cy='itemtype-select'>
                        <option v-for="type in useTypeStore().types" :value="type.id">
                            {{ appLanguage == 'hu' ? type.name : type.name_EN }}
                        </option>
                     </select>
                     <label for="ingredient">{{ t('ingredients') }}</label>
                     <select id="ingredient" class="form-control"
                        v-model="selectedIngredient" v-bind:disabled="selectedTypeId == null" v-on:focus="hideIngredientError()"
                        v-on:click="useItemStore().getItemsByTypeId(selectedTypeId!)" data-cy='item-select'>
                        <option v-for="ingr in useItemStore().items" :value="ingr">
                            {{appLanguage == 'hu' ? ingr.name : ingr.name_EN}}
                        </option>
                     </select>

                     <div class="row">
                        <div class="col-8">
                            <label for="quantity">{{ t("quantity") }}</label>
                            <input type="number" min="1" max="10000" class="form-control" v-model="ingredientQuantity"
                                v-on:focus="hideIngredientError()" data-cy='quantity-input'/>
                        </div>
                        <div class="col-4 py-4">
                            <span class="unit-span" v-if="selectedIngredient">{{ t(selectedIngredient!.unit) }}</span>
                        </div>
                     </div>
                     <p class="text-danger d-flex justify-content-center my-2" data-cy='ingredient-error'>
                        {{ appLanguage == "hu" ? ingrInputError?.message : ingrInputError?.messageEn }}
                    </p>
                     <div class="d-flex justify-content-center" v-on:click="saveIngredient">
                        <button class="btn btn-success" type="button" data-cy='save-ingredient'>{{ t("save") }}</button>
                     </div>
                </div>
                <div class="col-12 col-md-6" style="display: flex; float: left; flex-wrap: wrap;">
                    <div v-for="(ingr,index) in ingredients" :key="index" class="ingredient-div d-flex align-items-start">
                        <i class="bi bi-trash" v-on:click="deleteIngredient(ingr.item.id!)" data-cy='delete-ingredient'></i>
                        <div data-cy='ingredient-div'>
                            {{ `${appLanguage == 'hu' ? ingr.item.name : ingr.item.name_EN}`}}
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

                    <div class="row input-div p-3 mb-2">
                        <div class="row mb-2">
                            <div class="col-6">
                                <label for="step" class="form-label">{{ t("language") }}</label>
                                <select name="language" id="lang" class="form-control" v-model="selectedLanguage"
                                    v-on:change="{
                                        selectedStep = '1';
                                        stepInputError = '';
                                    }" data-cy='language-select'>
                                    <option value="hu">{{ t("hu") }}</option>
                                    <option value="en">{{ t("en") }}</option>
                                </select>
                            </div>
                            <div class="col-4">
                                <label for="step" class="form-label">{{ t("step") }}</label>
                                <input v-if="selectedLanguage == 'hu'" type="number" name="step" id="step"
                                   class="form-control" min="1" :max="descHU.length == 4 ? '4' : descHU.length+1" v-model="selectedStep" data-cy='stephu-input'>
                                <input v-if="selectedLanguage == 'en'" type="number" name="step" id="stepEn"
                                    class="form-control" min="1" :max="descEN.length == 4 ? '4' : descEN.length+1" v-model="selectedStep" data-cy='stepen-input'>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <label for="desc" class="form-label">{{ t("step") }}</label>
                                <textarea id="desc" class="form-control"
                                v-model="stepInput"
                                maxlength="90" :placeholder="appLanguage == 'hu' ? 'max 90 karakter' : 'max 90 charachter'" data-cy='step-textarea'
                                ></textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <span class="text-danger d-flex justify-content-center my-2" v-if="stepInputError" data-cy='step-error'>
                                {{ stepInputError }}
                            </span>
                            <div class="col-4 offset-5">
                                <button type="button" class="btn btn-success" v-on:click="saveStep" data-cy='save-step'>{{ t("save") }}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <h5>{{ t("steps") }}</h5>
                    <p>-- {{ selectedLanguage == 'hu' ? t("hu") : t("en") }} --</p>
                    <p v-if="descHU[0] != '' && selectedLanguage == 'hu'" v-for="(step, index) in descHU" data-cy='stephu'>
                        {{ `${index+1}. ${step}` }}
                    </p>
                    <p v-if="descEN[0] != '' && selectedLanguage == 'en'" v-for="(step, index) in descEN" data-cy='stepen'>
                        {{ `${index+1}. ${step}` }}
                    </p>
                </div>
            </div>
            <div v-if="recipesError.en != '' || recipesError.hu != ''" class="text-danger text-center mx-5 mb-2" data-cy='recipe-error'>
                {{ appLanguage == "hu" ? recipesError.hu : recipesError.en }}
            </div>
            <div class="row m-3">
                <div class="col d-flex justify-content-end">
                    <button type="button" class="btn btn-danger" v-on:click="closeEditor" data-cy='close-button'>{{ t("cancel") }}</button>
                </div>
                <div class="col">
                    <button type="submit" class="btn btn-success" data-cy='save-button'>{{ t("save") }}</button>
                </div>
            </div>
        </form>
        </div>
    </main>
</template>

<style lang="css" scoped src="@/assets/css/recipeeditor.css"></style>