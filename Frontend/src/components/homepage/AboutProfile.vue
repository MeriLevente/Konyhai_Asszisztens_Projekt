<script setup lang="ts">
    import { useUserStore } from '@/stores/userstore';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <h2 class="display-6 about-h2">{{ t('about_profileh2') }}</h2>
    <ul>
        <li><p class="about-p">{{ t('about_profileParag') }}</p></li>
        <li><p class="about-p">{{ t('about_profileParag2') }}</p></li>
        <li v-if="!useUserStore().status.loggedIn">
            <RouterLink to="/login" class="about-p">{{ t('clickme') }}</RouterLink>
        </li>
    </ul>
</template>

<style lang="css"/>