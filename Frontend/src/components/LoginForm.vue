<script setup lang="ts">
    import type IUser from '@/models/User';
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRouter } from 'vue-router';
    const { status } = storeToRefs(useUserStore());
    const { appLanguage } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["method", "role"]);
    const loading = ref<boolean>(false);
    const confirmPassword = ref<string>();
    const seePassword = ref<boolean>(false);
    const seeConfirmPassword = ref<boolean>(false);

    const router = useRouter();

    const formData = ref<IUser>({
        email: "",
        password: "",
        role: props.role
    });

    const submitForm = (): void => {
        const userData: IUser = {
                name: formData.value.name?.trim(),
                email: formData.value.email.trim(),
                password: formData.value.password.trim(),
                role: formData.value.role,
        };
        if(props.method == "register"){
            status.value.confirmPassword = confirmPassword.value!;
            loading.value = true;
            useUserStore().register(userData)!
            .then((): void => {
                if (props.role == 'user')
                    router.push("/");
                else
                {
                    alert(t("admin_reg_success"));
                    formData.value = {
                        name: "",
                        email: "",
                        password: "",
                        role: "admin"
                    };
                    confirmPassword.value = "";
                }
                loading.value = false;
            })
            .catch((): void => { loading.value = false; });
        } else {
            loading.value = true;
            useUserStore().login(userData)!.then((): void => {
                loading.value = false;
                router.push("/");
            })
            .catch((): void => { loading.value = false; });
        };
    };

    const toggleShowPassword = (inputField: string): void => {
        if (inputField == "password") {
            if (seePassword.value) {
                seePassword.value = false;
            } else {
                seePassword.value = true;
            }
        } else {
            if (seeConfirmPassword.value) {
                seeConfirmPassword.value = false;
            } else {
                seeConfirmPassword.value = true;
            }
        };
    };

    const hideError = (): void => {
        useUserStore().hideError();
    };
</script>

<template>
    <div class="row my-3">
        <div class="col-12">
            <h1 class="text-center display-2 text-bold" id="PageTitle">{{ role == 'admin' ? `Admin ${t(method)}` : t(method) }}</h1>
        </div>
    </div>
    <div class="row my-3">
        <div class="col-12 col-md-4 mx-auto">
            <form @submit.prevent="submitForm()">
                <div class="form-floating mb-3" v-if="method == 'register'">
                    <input type="text" class="form-control" id="name" v-model="formData.name" maxlength="50"
                        v-on:focus="() => { if(status.message && status.messageEn) hideError();}">
                    <label for="name">{{t("name_form")}}</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="email" v-model="formData.email" maxlength="320" 
                        v-on:focus="() => { if(status.message && status.messageEn) hideError(); }">
                    <label for="email">Email</label>
                </div>
                <div class="form-floating mb-3">
                    <input :type="seePassword ? 'text' : 'password'" class="form-control" id="password"
                        v-model="formData.password" style="z-index: 0" maxlength="30"
                        v-on:focus="() => { if(status.message && status.messageEn) hideError(); }">
                    <span class="toggle-password" v-on:click="toggleShowPassword('password')">
                        <i :class="seePassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                    <label for="password">{{t("password_form")}}</label>
                </div>
                <div class="form-floating mb-3" v-if="method == 'register'">
                    <input :type="seeConfirmPassword ? 'text' : 'password'" class="form-control" id="confirmpass"
                        v-model="confirmPassword" maxlength="30" v-on:focus="() => { if(status.message && status.messageEn) hideError();}">
                    <span class="toggle-password" v-on:click="toggleShowPassword('confirm_password')">
                        <i :class="seeConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                    <label for="confirmpass">{{t("confirm_password_form")}}</label>
                </div>
                <RouterLink to="/register" v-if="method != 'register'" class="my-2">{{ t("go_register") }}</RouterLink>
                <div v-if="status.message && status.messageEn" class="text-danger text-center" id="error-message">
                    {{ appLanguage == "hu" ? status.message : status.messageEn }}
                </div>
                <div class="mb-1">
                    <button id="submit" type="submit" class="btn btn-primary w-100 p-2 my-3">
                        {{ t(method) }}
                        <span v-if="loading" class="spinner-border spinner-border-sm text-center"></span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style lang="css">
    #submit {
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

    #error-message {
        font-family: Funnel Sans, sans-serif;
        font-weight: bold;
    }
</style>