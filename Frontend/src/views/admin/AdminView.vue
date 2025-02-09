<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const navigateToPage = (to: string) : void => {
        router.push(to);
    };
</script>

<template>
    <div class="container my-5 justify-center">
        <div class="row">
            <h1 class="display-3 text-center">{{t('admin_h1')}}</h1>
        </div>
        <div class="row row-content my-5 d-flex justify-content-center">
            <div class="col-11 col-sm-5 admin-box-blue m-1" v-on:click="navigateToPage('/add-type')">
                <p class="link-box-blue">Add type</p>
            </div>
            <div class="col-11 col-sm-5 admin-box-white m-1" v-on:click="navigateToPage('/edit-items')">
                <p class="link-box-white">Edit item</p>
            </div>
            <div class="col-11 col-sm-5 admin-box-white m-1" v-on:click="navigateToPage('/edit-recipes')">
                <p class="link-box-white">Edit recipe</p>
            </div>
            <div class="col-11 col-sm-5 admin-box-blue m-1" v-on:click="navigateToPage('/register-admin')">
                <p class="link-box-blue">Register admin</p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
    .row-content{
        height: 60vh;
    }

    .admin-box-blue{
        height: 25vh;
        background-color: var(--ebony-clay);
        border: 1px solid var(--mercury);
        border-radius: 3px;
        cursor: pointer;
    }

    .admin-box-white{
        height: 25vh;
        background-color: var(--mercury);
        border: 3px solid var(--ebony-clay);
        border-radius: 3px;
        cursor: pointer;
    }

    .link-box-blue{
        text-decoration: none;
        font-size: 5vh;
        color: var(--mercury);
    }

    .link-box-white{
        text-decoration: none;
        font-size: 5vh;
        color: var(--ebony-clay);
    }
</style>