<script setup lang="ts">
    import LoginForm from '@/components/LoginForm.vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    let method: string = t("register_h1");
</script>

<template>
    <div class="container my-5">
        <LoginForm :method="method" :role="'user'"/>
    </div>
</template>

<style lang="css">

</style>