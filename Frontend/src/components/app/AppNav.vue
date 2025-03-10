<template>
    <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@\assets\images\fridgebuddy.png" alt="Lógó" width="90" height="60" class="d-inline-block align-text-center">
        <span class="navbar-title mercury-nav-element">DiKA</span>
      </a>
      <button class="navbar-toggler mercury-nav-button navbar-ligth bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <div v-for="(menuItem, index) in menuItems" :key="index">
            <li class="nav-item">
              <!-- && menuItem.roles.includes(user.role) -->
              <router-link class="nav-link mercury-nav-element d-flex justify-content-center"
                :to="menuItem.to" v-if="menuItem.isVisible ">{{ i18n.global.locale.value == "hu" ? menuItem.title : menuItem.title_EN }}
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
    const router = useRouter();
    
    const menuItems = computed(()=>{
      return [
        {
            title: "Nyitó oldal",
            title_EN: "Home",
            to: '/',
            isVisible: true,
            roles: ["", "admin", "user"]
        },
        {
            title: "Bejelentkezés",
            title_EN: "Login",
            to: '/login',
            isVisible: !status.value.loggedIn,
            roles: ["", "admin", "user"]
        },
        {
            title: "Konyhám",
            title_EN: "My Kitchen",
            to: '/items',
            isVisible: !status.value.loggedIn,
            roles: ["user"]
        },
        {
            title: "Receptek",
            title_EN: "Recipes",
            to: '/recipes',
            isVisible: !status.value.loggedIn,
            roles: ["user"]
        },
        {
            title: "Admin",
            title_EN: "Admin",
            to: '/admin',
            isVisible: !status.value.loggedIn,
            roles: ["admin"]
        },
    ]
    });

    const changeLanguage = () : void => {
      const lang: string = i18n.global.locale.value;
      if(lang == "hu"){
        i18n.global.locale.value = 'en';
        useAppStore().app_language = 'en';
        localStorage.setItem('lang', 'en');
      }
      else{
        i18n.global.locale.value = 'hu';
        useAppStore().app_language = 'hu';
        localStorage.setItem('lang', 'hu');
      }
    };

    const onLogout = () : void => {
      logout().then(()=>router.push('/'))
    };
</script>

<style scoped>
nav{
    background-color: var(--ebony-clay);
    border-bottom: 0.5rem solid white;
}

.mercury-nav-element{
    color: var(--mercury);
}

.mercury-nav-button{
    border-color: var(--mercury);
}

.bg-hu{
  background-image: url('@/assets/images/huflag.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.bg-en{
  background-image: url('@/assets/images/enflag.png');
  background-size: cover;
  background-repeat: no-repeat;
}
</style>