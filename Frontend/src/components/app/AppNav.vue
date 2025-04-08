<template>
    <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@\assets\images\fridgebuddy.png" alt="Lógó" width="90" height="60" class="d-inline-block align-text-center">
        <span class="navbar-title mercury-nav-element">DiKAMON</span>
      </a>
      <button class="navbar-toggler mercury-nav-button navbar-ligth bg-light" type="button"
        data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <div v-for="(menuItem, index) in menuItems" :key="index">
            <li class="nav-item">
              <router-link class="nav-link mercury-nav-element d-flex justify-content-center"
                :to="menuItem.to" v-if="menuItem.isVisible">{{ i18n.global.locale.value == "hu" ? menuItem.title : menuItem.titleEn }}
              </router-link>
            </li>
          </div>
        </ul>
        <a :class="i18n.global.locale.value == 'hu' ? 'bg-hu btn' : 'bg-en btn'" id="langBtn" v-on:click="changeLanguage()"></a>
        <a v-if="useUserStore().status.loggedIn" class="btn btn-danger mx-4" v-on:click="onLogout">{{ t("logout") }}</a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/userstore';
    const { logout } = useUserStore();
    import i18n from '@/translations';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const { status } = storeToRefs(useUserStore());
    import { useRouter } from 'vue-router';
    import { useAppStore } from '@/stores/appstore';
    import UserValidation from '@/utils/UserValidation';
    const router = useRouter();

    const menuItems = computed(() => {
      return [
        {
            title: "Nyitó oldal",
            titleEn: "Home",
            to: '/',
            isVisible: true,
        },
        {
            title: "Bejelentkezés",
            titleEn: "Login",
            to: '/login',
            isVisible: !status.value.loggedIn,
        },
        {
            title: "Konyhám",
            titleEn: "My Kitchen",
            to: '/items',
            isVisible: status.value.loggedIn && useUserStore().user?.role && UserValidation.isAutherizedRole("user"),
        },
        {
            title: "Receptek",
            titleEn: "Recipes",
            to: '/recipes',
            isVisible: status.value.loggedIn && useUserStore().user?.role && UserValidation.isAutherizedRole("user"),
        },
        {
            title: "Admin",
            titleEn: "Admin",
            to: '/admin',
            isVisible: status.value.loggedIn && useUserStore().user?.role && UserValidation.isAutherizedRole("admin"),
        },
    ]});

    const changeLanguage = (): void => {
      const lang: string = i18n.global.locale.value;
      if (lang == "hu") {
        i18n.global.locale.value = 'en';
        useAppStore().appLanguage = 'en';
        localStorage.setItem('lang', 'en');
      }
      else {
        i18n.global.locale.value = 'hu';
        useAppStore().appLanguage = 'hu';
        localStorage.setItem('lang', 'hu');
      }
    };

    const onLogout = (): void => {
      logout().then(()=>router.push('/'));
    };
</script>

<style scoped>
nav {
    background-color: var(--ebony-clay);
    border-bottom: 0.5rem solid white;
}

.mercury-nav-element {
    color: var(--mercury);
}

.mercury-nav-button {
    border-color: var(--mercury);
}

.bg-hu {
  background-image: url('@/assets/images/huflag.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.bg-en {
  background-image: url('@/assets/images/enflag.png');
  background-size: cover;
  background-repeat: no-repeat;
}
</style>