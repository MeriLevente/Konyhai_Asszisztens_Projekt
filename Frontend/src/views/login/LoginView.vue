<script setup lang="ts">
    import LoginForm from '@/components/LoginForm.vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    let method: string = t("login_h1");
</script>

<template>
    <div class="container my-5 align-center">
        <LoginForm :method="method" :role="'user'"/>
    </div>
</template>

<style lang="css">
    .container{
        background-color: var(--mercury);
        border: 3px solid var(--ebony-clay);
        border-radius: 5px;
    }
</style>