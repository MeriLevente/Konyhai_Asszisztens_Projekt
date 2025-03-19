<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <div class="container">
        <div class="py-5">
            <img src="@/assets/images/sadfridge.png" class="notfound-img" alt="Not found!">
            <div class="notfound-div">
                <h1>404 - {{ t("notfound_h1") }}</h1>
                <p>{{ t("notfound_text") }}</p>
                <RouterLink class="d-flex justify-content-center back-to-home mx-5" to="/">{{ t('toHome') }}</RouterLink>
            </div>
        </div>
    </div>
</template>

<style lang="css">
    .back-to-home {
        background-color: var(--ebony-clay);
        border-radius: 20px;
        color: white;
        text-decoration: none;
        padding: 0.75rem;
    }
    .notfound-img {
        width: 15rem;
        height: 15rem;
        display: inline-block;
    }
    .notfound-div {
        display: inline-block;
        margin-top: 3rem;
    }
    @media only screen and (max-width: 990px) {
        .notfound-img {
            width: 12rem;
            height: 12rem;
            transform: translateX(50%);
        }
        .notfound-div {
            font-size: 0.8rem;
            margin-left: 1rem;
        }
    }
</style>