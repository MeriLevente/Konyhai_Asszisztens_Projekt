<script setup lang="ts">
    import LoginForm from '@/components/LoginForm.vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    let method: string = t("register_h1");
</script>

<template>
    <div class="content-box m-3">
        <div class="container">
            <div class="row">
                <RouterLink class="back-to-admin" to="/admin">Admin >> {{ t('register_h1') }}</RouterLink>
            </div>
            <LoginForm :method="method" :role="'admin'"/>
        </div> 
    </div>
</template>

<style lang="css" scoped>
    .content-box {
        height: 90vh;
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