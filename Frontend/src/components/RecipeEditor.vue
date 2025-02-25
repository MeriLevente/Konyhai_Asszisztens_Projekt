<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useAdminStore } from '@/stores/adminstore';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from '@/stores/appstore';
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
    const emit = defineEmits(["editorClosed", "saveData"]);
    const { recipe_types, recipes_error } = storeToRefs(useAdminStore());
    const { app_language } = storeToRefs(useAppStore());

    const selectedStep = ref("1");
    const selectedLanguage = ref("hu");

    let descHU = ref<string[]>(props.recipe.descriptionHU == "" ? [] : props.recipe.descriptionHU.split("#"));
    let descEN = ref<string[]>(props.recipe.descriptionEN == "" ? [] : props.recipe.descriptionEN.split("#"));
    let stepInput = ref<string>();

    const closeEditor = () => {
        emit("editorClosed");
    };

    let saveStep = (): void => {
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
                    <input type="number" class="form-control m-1" id="difficulty" v-model="recipe.difficulty" min="1" max="10">
                    <label for="image" class="form-label">{{ t("image") }}</label>
                    <input type="text" class="form-control m-1" id="image" v-model="recipe.image">
                </div>
                <div class="col-12 col-md-6 mb">
                    <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                    <input type="text" class="form-control m-1" id="nameEN" v-model="recipe.nameEN">
                    <label for="time" class="form-label">{{ t("time") }}</label>
                    <input type="number" class="form-control m-1" id="time" v-model="recipe.time" min="1" max="10080">
                    <label for="type" class="form-label">{{ t("type") }}</label>
                    <select name="type" id="type" class="form-control m-1" v-model="recipe.type">
                        <option v-for="type in recipe_types.types" :value="type.short" :selected="recipe.type == type.short">{{ app_language.lang == "hu" ? type.hu : type.en  }}</option>
                    </select>
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
                                <input v-if="selectedLanguage == 'hu'" type="number" name="step" id="step" class="form-control" min="1" :max="descHU.length == 4 ? '4' : descHU.length+1" v-model="selectedStep">
                                <input v-if="selectedLanguage == 'en'" type="number" name="step" id="step" class="form-control" min="1" :max="descEN.length == 4 ? '4' : descEN.length+1" v-model="selectedStep">
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
            <div v-if="recipes_error.hu != '' && recipes_error.en != ''" class="text-danger text-center mx-5 mb-2">{{ app_language.lang == 'hu' ? recipes_error.hu : recipes_error.en }}</div>
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
</style>