<script setup lang="ts">
    import type IFormData from '@/models/FormData';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const props = defineProps(["method", "role"]);

    const formData = ref<IFormData>({
        email: "",
        password: "",
        role: props.role
    });

    const submitForm = () : void => {
        // userStore-ba register vagy login függvény és a logot töröld
        console.log(formData.value);
    };
</script>

<template>
    <div class="row my-3">
        <div class="col-12">
            <h1 class="text-center display-2 text-bold">{{ role == 'admin' ? `Admin ${method}` : method }}</h1>
        </div>
    </div>
    <div class="row my-3">
        <div class="col-12 col-md-4 mx-auto">
            <form @submit.prevent="submitForm()">
                <div class="form-floating mb-3" v-if="method == 'Regisztrálás' || method == 'Register'">
                    <input type="text" class="form-control" id="name" v-model="formData.name" required>
                    <label for="name">{{t("name_form")}}</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="email" v-model="formData.email" required>
                    <label for="email">Email</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="password" v-model="formData.password" required>
                    <label for="password">{{t("password_form")}}</label>
                </div>
                <div class="form-floating mb-3" v-if="method == 'Regisztrálás' || method == 'Register'">
                    <input type="password" class="form-control" id="confirmpass" v-model="formData.confirm_password" required>
                    <label for="confirmpass">{{t("confirm_password_form")}}</label>
                </div>
                <RouterLink to="/register" v-if="method != 'Regisztrálás' && method != 'Register'" class="my-2">{{ t("go_register") }}</RouterLink>
                <div class="mb-3">
                    <button id="submit" type="submit" class="btn btn-primary w-100 p-2 my-3">{{ method }}</button>
                </div>
            </form>
            <!-- <div v-if="status.message" class="alert alert-danger text-center mt-5">{{ status.message }}</div> -->
        </div>
    </div>
</template>

<style lang="css">
    #submit{
        background-color: var(--ebony-clay);
        color: var(--mercury);
        font-weight: bold;
    }
</style>