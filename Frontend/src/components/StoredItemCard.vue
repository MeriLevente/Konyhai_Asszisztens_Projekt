<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { storeToRefs } from 'pinia';
    const { app_language } = storeToRefs(useAppStore());
    const props = defineProps(["item"]);
</script>

<template>
    <div class="stored-card card">
        <img class="card-img-top" :src="item.storedItem.image" :alt="`${item.storedItem.name_EN} image`">
        <div class="card-body d-flex justify-content-between">
            <div>
                <h2 class="card-title">{{ app_language == 'hu' ? item.storedItem.name : item.storedItem.name_EN }}</h2>
                <p class="card-text">{{ `${item.quantity} ${item.storedItem.unit}` }}</p>
            </div>
            <div class="align-self-end">
                <span class="qty-btn"><i class="bi bi-arrow-up"></i></span>
                <span class="qty-btn"><i class="bi-arrow-down"></i></span>
            </div>
        </div>
    </div>
    
</template>

<style lang="css">
    .stored-card{
        border: 2px solid var(--ebony-clay);
        border-radius: 20px;
        background-color: white;
        color: var(--ebony-clay);
        font-weight: bold;
    }
    .card-img-top{
        border-radius: 20px 20px 0 0;
        height: 15rem;
        border-bottom: 2px solid var(--ebony-clay);
    }
    .qty-btn {
        cursor: pointer;
        background-color: var(--ebony-clay);
        color: white;
        padding: 0.3rem;
        margin-right: 2px;
        border-radius: 30px;
    }
    .qty-btn > i {
        font-weight: bold;
        font-size: 1rem;
    }

    @media only screen and (max-width: 960px) {
        .card-img-top {
            height: 12rem;
        }
    }
</style>