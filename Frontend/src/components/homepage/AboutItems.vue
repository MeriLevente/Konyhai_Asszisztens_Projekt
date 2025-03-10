<script setup lang="ts">
    import { useUserStore } from '@/stores/userstore';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <h2 class="display-6 about-h2">{{ t('about_itemsh2') }}</h2>
    <div class="d-flex justify-content-between">
        <ul style="display: inline;">
            <li><p class="about-p">{{ t('about_itemsParag') }}</p></li>
            <li><p class="about-p">{{ t('about_itemsParag2') }}</p></li>
            <div class="d-flex justify-content-start">
                <RouterLink to="/login" v-if="!useUserStore().status.loggedIn" class="about-p btn btn-warning">{{ t('clickmeRegisterFirst') }}</RouterLink>
                <RouterLink to="/items" v-if="useUserStore().status.loggedIn" class="recipebook-btn">{{ t('clickmeTakeMeThere') }}</RouterLink>
            </div>
        </ul>
        <img src="@/assets/images/fridgebuddy_suit.png" alt="Manager fridge" class="fridge-image">
    </div>
</template>

<style lang="css">
    
</style>