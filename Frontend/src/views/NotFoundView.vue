<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <div class="container">
        <div class="py-5">
            <img src="@/assets/images/sadfridge.png" class="w-30 h-5" alt="Not found!" style="width: 20vw; height: 20vw; display: inline-block;">
            <div style="display: inline-block;">
                <h1>404 - {{ t("notfound_h1") }}</h1>
                <p>{{ t("notfound_text") }}</p>
                <RouterLink class="d-flex justify-content-center back-to-home mx-5" to="/">{{ t('toHome') }}</RouterLink>
            </div>
        </div>
    </div>
</template>

<style lang="css">
    .back-to-home{
        background-color: var(--ebony-clay);
        border-radius: 20px;
        color: white;
        text-decoration: none;
        padding: 0.75rem;
    }
</style>