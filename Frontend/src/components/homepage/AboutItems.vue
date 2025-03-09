<script setup lang="ts">
    import { useUserStore } from '@/stores/userstore';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <h2 class="display-6 about-h2">{{ t('about_itemsh2') }}</h2>
    <ul>
        <li><p class="about-p">{{ t('about_itemsParag') }}</p></li>
        <li><p class="about-p">{{ t('about_itemsParag2') }}</p></li>
        <div class="d-flex justify-content-center">
            <RouterLink to="/login" v-if="!useUserStore().status.loggedIn" class="about-p btn btn-warning">{{ t('clickmeRegisterFirst') }}</RouterLink>
            <RouterLink to="/items" v-if="useUserStore().status.loggedIn" class="recipebook-btn p-1">{{ t('clickmeTakeMeThere') }}</RouterLink>
        </div>
    </ul>
</template>

<style lang="css">
    
</style>