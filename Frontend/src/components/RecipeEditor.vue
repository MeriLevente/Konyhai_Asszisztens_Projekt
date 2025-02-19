<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useAdminStore } from '@/stores/adminstore';
    import { storeToRefs } from 'pinia';
    import { useAppStore } from '@/stores/appstore';
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
    const emit = defineEmits(["editorClosed"]);
    const { recipe_types } = storeToRefs(useAdminStore());
    const { app_language } = storeToRefs(useAppStore());

    const selectedStep = ref("1");
    const selectedLanguage = ref("hu");

    const descHU = computed(():string[] => {return props.recipe.descriptionHU.split("#")});
    const descEN = ref<string[]>(props.recipe.descriptionEN.split("#"));

    let stepInput = computed(()=> {
            return selectedLanguage.value == 'hu' ? descHU.value[Number(selectedStep.value)-1] : descEN.value[Number(selectedStep.value)-1]
        }   
    );

    const closeEditor = () => {
        emit("editorClosed");
    };

    const saveStep = (): void => {
        if(stepInput.value.length > 0){
            if(selectedLanguage.value == "hu")
                descHU.value[Number(selectedStep.value)-1] = stepInput.value
            if(selectedLanguage.value == "en")
                descEN.value[Number(selectedStep.value)-1] = stepInput.value
        }
    };
</script>

<template>
    <div class="content-box my-5">
        <div class="container">
            <h1 class="text-center">{{ t("recipe_editor") }}</h1>
            <div class="row mb-2">
                <div class="col-12 col-md-6">
                    <label for="nameHU" class="form-label">{{ t("name") }} (hu)</label>
                    <input type="text" class="form-control m-1" id="nameHU" v-model="recipe.nameHU" required>
                    <label for="difficulty" class="form-label">{{ t("difficulty") }}</label>
                    <input type="number" class="form-control m-1" id="difficulty" v-model="recipe.difficulty" required min="1" max="10">
                    <label for="image" class="form-label">{{ t("image") }}</label>
                    <input type="text" class="form-control m-1" id="image" v-model="recipe.image" required>
                </div>
                <div class="col-12 col-md-6 mb">
                    <label for="nameEN" class="form-label">{{ t("name") }} (en)</label>
                    <input type="text" class="form-control m-1" id="nameEN" v-model="recipe.nameEN" required>
                    <label for="time" class="form-label">{{ t("time") }}</label>
                    <input type="number" class="form-control m-1" id="time" v-model="recipe.time" required min="1" max="1000">
                    <label for="type" class="form-label">{{ t("type") }}</label>
                    <select name="type" id="type" class="form-control m-1" required>
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
                                <select name="language" id="lang" class="form-control" v-model="selectedLanguage">
                                    <option value="hu">Magyar</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div class="col-4">
                                <label for="step" class="form-label">{{ t("step") }}</label>
                                <select name="step" id="step" class="form-control" v-model="selectedStep">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
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
                                <button class="btn btn-success" v-on:click="saveStep">{{ t("save") }}</button>
                            </div>
                        </div>
                    </div>     
                </div>
                <div class="col-12 col-md-6">
                    <h5>{{ t("steps") }}</h5>
                    <p v-if="descHU.length > 0 && selectedLanguage == 'hu'" v-for="(step, index) in descHU">{{ `${index+1}. ${step}` }}</p>
                    <p v-if="descEN.length > 0 && selectedLanguage == 'en'" v-for="(step, index) in descEN">{{ `${index+1}. ${step}` }}</p>
                </div>
            </div>
            <div class="row m-3">
                <div class="col d-flex justify-content-end">
                    <button class="btn btn-danger" v-on:click="closeEditor">{{ t("cancel") }}</button>
                </div>
                <div class="col">
                    <button class="btn btn-success" v-on:click="closeEditor">{{ t("save") }}</button>
                </div>
            </div>
        </div> 
    </div>
</template>

<style lang="css" scoped>
    .content-box {
        height: 75vh;
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
</style>