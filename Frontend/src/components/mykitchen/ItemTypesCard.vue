<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    const { appLanguage } = storeToRefs(useAppStore());
    const props = defineProps(["type"]);
    const emit = defineEmits(["typeClicked"]);

    const typeClicked = (id: number): void => {
        emit("typeClicked", id);
    };
</script>

<template>
    <div class="col-10 col-md-3 m-1 type-card" 
        :style="{backgroundImage:'url(' + type.image + ')' }"
        v-on:click="typeClicked(type.id)">
        <div class="title w-75">
            <h2 class="pt-1">{{ appLanguage == 'hu' ? type.name : type.name_EN }}</h2>
        </div>    
    </div>
</template>

<style lang="css" scoped>
    .type-card {
        border: 2px solid var(--ebony-clay);
        border-radius: 20px;
        color: var(--ebony-clay);
        font-weight: bold;
        background-repeat: no-repeat;
        background-size: cover;
        height: 15rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
        text-align: center;
    }
    .title {
        z-index: -1;
        border-radius: 18px 0 18px 0;
        background-color: black;
        color: white;
        height: 3rem;
    }

    h2{
        vertical-align: center;
        font-size: 1.5rem;
    }
    
    @media only screen and (max-width: 960px) {
        h2 {
            font-size: 1.2rem;
        }
    }
</style>