<script setup lang="ts">
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const props = defineProps(["recipe"])
    const emit = defineEmits(["editorClosed"])

    let descHU = ref<string[]>(props.recipe.descriptionHU.split("#"))
    let descEN = ref<string[]>(props.recipe.descriptionEN.split("#"))

    const closeEditor = () => {
        emit("editorClosed");
    }; 
</script>

<template>
    <div class="content-box my-5">
        <div class="container">
            <h1 class="text-center">{{ t("recipe_editor") }}</h1>
            <p>{{ recipe.nameHU }}</p>
            <p v-for="(step, index) in descHU">{{ `${index+1}. ${step}` }}</p>
            <button class="btn btn-danger" v-on:click="closeEditor">{{ t("close") }}</button>
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
</style>