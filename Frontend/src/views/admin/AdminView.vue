<script setup lang="ts">
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    import { useRouter } from 'vue-router';

    const router = useRouter();
    let windowWidth = ref<number>(window.innerWidth);

    window.addEventListener('resize', ()=>{
        windowWidth.value = window.innerWidth
    });

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
            <div class="col-11 col-sm-5 p-2 admin-box-blue m-1" v-on:click="navigateToPage('/add-type')">
                <p class="text-center display-5">{{ t("edit_type") }}</p>
                <i class="bi bi-egg d-flex justify-content-center"></i>
            </div>
            <div class="col-11 col-sm-5 admin-box-white m-1" v-on:click="navigateToPage('/edit-items')">
                <p class="text-center p-2 display-5">{{ t("edit_items") }}</p>
                <i class="bi bi-apple d-flex justify-content-center"></i>
            </div>
            <div class="col-11 col-sm-5 p-2 m-1" v-on:click="navigateToPage('/edit-recipes')" :class="windowWidth > 575 ? 'admin-box-white' : 'admin-box-blue'">
                <p class="text-center display-5">{{ t("edit_recipes") }}</p>
                <i class="bi bi-journals d-flex justify-content-center"></i>
            </div>
            <div class="col-11 col-sm-5 p-2 admin-box-blue m-1" v-on:click="navigateToPage('/register-admin')" :class="windowWidth > 575 ? 'admin-box-blue' : 'admin-box-white'">
                <p class="text-center display-5">{{ t("admin_reg") }}</p>
                <i class="bi bi-person-add d-flex justify-content-center"></i>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
    .row-content{
        height: 60vh;
    }

    .admin-box-blue {
        height: 25vh;
        background-color: var(--ebony-clay);
        border: 1px solid var(--mercury);
        border-radius: 3px;
        cursor: pointer;
    }

    .admin-box-blue > p{
        text-decoration: none;
        font-size: 5vh;
        color: var(--mercury);
    }

    .admin-box-blue > i {
        font-size: 8.5vh;
        color: var(--mercury);
    }

    .admin-box-white{
        height: 25vh;
        background-color: var(--mercury);
        border: 3px solid var(--ebony-clay);
        border-radius: 3px;
        cursor: pointer;
    }

    .admin-box-white > p{
        text-decoration: none;
        font-size: 5vh;
        color: var(--ebony-clay);
    }

    .admin-box-white > i {
        font-size: 8.5vh;
        color: var(--ebony-clay);
    }
</style>