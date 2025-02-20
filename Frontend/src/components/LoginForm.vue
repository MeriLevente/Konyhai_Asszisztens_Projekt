<script setup lang="ts">
    import type IUser from '@/models/User';
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRouter } from 'vue-router';
    const { status } = storeToRefs(useUserStore());
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const { login, register } = useUserStore();
    const props = defineProps(["method", "role"]);

    let confirm_password = ref<string>();
    let see_password = ref<boolean>(false);
    let see_conf_password = ref<boolean>(false);

    const router = useRouter()

    const formData = ref<IUser>({
        email: "",
        password: "",
        role: props.role
    });

    const submitForm = () : void => {
        // userStore-ba register vagy login függvény és a logot töröld
        if(props.method == "Regisztrálás" || props.method == "Register"){
            status.value.confirm_password = confirm_password.value!;
            register(formData.value).then(()=>{
                router.push("/")
            });
        } else {
            login(formData.value).then(()=>{
                router.push("/")
            });;
        };
    };

    const toggleShowPassword = (inputField: string) : void => {
        if(inputField == "password"){
            if(see_password.value){
                see_password.value = false;
            } else {
                see_password.value = true;
            }
        } else {
            if(see_conf_password.value){
                see_conf_password.value = false;
            } else {
                see_conf_password.value = true;
            }
        }
    };

    const hideError = (): void =>{
        status.value.message = '';
        status.value.messageEn = '';
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
                    <input type="text" class="form-control" id="name" v-model="formData.name" maxlength="50" v-on:focus="() => {if(status.message && status.messageEn) hideError()}">
                    <label for="name">{{t("name_form")}}</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="email" v-model="formData.email" maxlength="320" v-on:focus="() => {if(status.message && status.messageEn) hideError()}">
                    <label for="email">Email</label>
                </div>
                <div class="form-floating mb-3">
                    <input :type="see_password ? 'text' : 'password'" class="form-control" id="password" v-model="formData.password" style="z-index: 0" maxlength="30" v-on:focus="() => {if(status.message && status.messageEn) hideError()}">
                    <span class="toggle-password" v-on:click="toggleShowPassword('password')"><i :class="see_password ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i></span>
                    <label for="password">{{t("password_form")}}</label>
                </div>
                <div class="form-floating mb-3" v-if="method == 'Regisztrálás' || method == 'Register'">
                    <input :type="see_conf_password ? 'text' : 'password'" class="form-control" id="confirmpass" v-model="confirm_password" maxlength="30" v-on:focus="() => {if(status.message && status.messageEn) hideError()}">
                    <span class="toggle-password" v-on:click="toggleShowPassword('confirm_password')"><i :class="see_conf_password ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i></span>
                    <label for="confirmpass">{{t("confirm_password_form")}}</label>
                </div>
                <RouterLink to="/register" v-if="method != 'Regisztrálás' && method != 'Register'" class="my-2">{{ t("go_register") }}</RouterLink>
                <div class="mb-1">
                    <button id="submit" type="submit" class="btn btn-primary w-100 p-2 my-3">{{ method }}</button>
                </div>
            </form>
            <div v-if="status.message && status.messageEn" class="alert alert-danger text-center">{{ app_language.lang == "hu" ? status.message : status.messageEn }}</div>
        </div>
    </div>
</template>

<style lang="css">
    #submit{
        background-color: var(--ebony-clay);
        color: var(--mercury);
        font-weight: bold;
    }

    .toggle-password {
        z-index: 1;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        cursor: pointer;
        width: 20px;
        height: 20px;
    }

    i {
        font-size: 15px;
    }
</style>