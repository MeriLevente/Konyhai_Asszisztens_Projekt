<script setup lang="ts">
    import LoginForm from '@/components/LoginForm.vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    let method: string = t("register_h1");
</script>

<template>
    <div class="content-box my-5">
        <div class="container">
            <LoginForm :method="method" :role="'admin'"/>
        </div> 
    </div>
</template>

<style lang="css" scoped>
    .content-box {
        height: 75vh;
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