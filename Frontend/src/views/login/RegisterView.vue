<script setup lang="ts">
    import LoginForm from '@/components/LoginForm.vue';
    import { useUserStore } from '@/stores/userstore';
    useUserStore().hideError();
</script>

<template>
    <div class="content-box my-5 mx-3">
        <div class="container">
            <LoginForm :method="'register'" :role="'user'"/>
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