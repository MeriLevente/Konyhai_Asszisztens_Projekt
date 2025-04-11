<script setup lang="ts">
    import LoginForm from '@/components/LoginForm.vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    import { useUserStore } from '@/stores/userstore';
    useUserStore().hideError();
</script>

<template>
    <main class="content-box m-3">
        <div class="container">
            <div class="row">
                <RouterLink class="back-to-admin" to="/admin" data-cy="back-button">Admin >> {{ 'Admin ' + t('register') }}</RouterLink>
            </div>
            <LoginForm :method="'register'" :role="'admin'"/>
        </div> 
    </main>
</template>

<style lang="css" scoped>
    .content-box {
        font-family: "Funnel Sans", sans-serif;
        height: 85vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container {
        background-color: var(--mercury);
        border: 3px solid var(--ebony-clay);
        border-radius: 5px;
    }
    body {
        font-family: "Funnel Sans", sans-serif;
    }
</style>