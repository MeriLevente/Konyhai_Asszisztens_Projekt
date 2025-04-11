<script setup lang="ts">
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const windowWidth = ref<number>(window.innerWidth);

    window.addEventListener('resize', (): void => {
        windowWidth.value = window.innerWidth;
    });

    const navigateToPage = (to: string): void => {
        router.push(to);
    };
</script>

<template>
    <main class="container my-5">
        <div class="row">
            <h1 class="display-3 text-center">{{t('admin_h1')}}</h1>
        </div>
        <div class="row row-content my-5 d-flex justify-content-center" data-cy="admin-links">
            <div class="col-11 col-sm-5 p-2 admin-box-blue m-1" v-on:click="navigateToPage('/edit-types')" data-cy="admin-block">
                <p class="text-center display-5">{{ t("edit_type") }}</p>
                <i class="bi bi-egg d-flex justify-content-center"></i>
            </div>
            <div class="col-11 col-sm-5 admin-box-white m-1" v-on:click="navigateToPage('/edit-items')" data-cy="admin-block">
                <p class="text-center p-2 display-5">{{ t("edit_items") }}</p>
                <i class="bi bi-apple d-flex justify-content-center"></i>
            </div>
            <div class="col-11 col-sm-5 p-2 m-1" v-on:click="navigateToPage('/edit-recipes')" data-cy="admin-block"
                :class="windowWidth > 575 ? 'admin-box-white' : 'admin-box-blue'">
                <p class="text-center display-5">{{ t("edit_recipes") }}</p>
                <i class="bi bi-journals d-flex justify-content-center"></i>
            </div>
            <div class="col-11 col-sm-5 p-2 admin-box-blue m-1" v-on:click="navigateToPage('/register-admin')" data-cy="admin-block"
                :class="windowWidth > 575 ? 'admin-box-blue' : 'admin-box-white'">
                <p class="text-center display-5">{{ t("admin_reg") }}</p>
                <i class="bi bi-person-add d-flex justify-content-center"></i>
            </div>
        </div>
    </main>
</template>

<style lang="css" scoped src="@/assets/css/admin.css"/>