<script setup lang="ts">
    import { useUserStore } from '@/stores/userstore';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <h2 class="display-6 about-h2">{{ t('about_recipesh2') }}</h2>
    <div class="d-flex justify-content-between">
        <ul style="display: inline-block;">
            <li><p class="about-p">{{ t('about_recipesParag') }}</p></li>
            <li><p class="about-p">{{ t('about_recipesParag2') }}</p></li>
            <li><p class="about-p">{{ t('about_recipesParag3') }}</p></li>
            <li><p class="about-p">{{ t('about_recipesParag4') }}</p></li>
            <div class="d-flex justify-content-start" v-if="useUserStore().user?.role != 'admin'">
                <RouterLink to="/login" v-if="!useUserStore().status.loggedIn" class="about-p btn btn-warning">{{ t('clickmeRegisterFirst') }}</RouterLink>
                <RouterLink to="/recipes" v-if="useUserStore().status.loggedIn" class="recipebook-btn">{{ t('about_recipesLink') }}</RouterLink>
            </div>
        </ul>
        <img src="@/assets/images/fridgebuddy_chef.png" alt="Chef fridge" class="fridge-image">
    </div>
</template>

<style lang="css">
    .recipebook-btn {
        background-color: var(--barley);
        border: 1px solid var(--charade);
        border-radius: 5px;
        font-weight: bold;
        color: white;
        font-size: 0.9em;
        text-decoration: none;
        padding: 0.3rem;
    }
    
</style>