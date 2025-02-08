<template>
    <nav class="navbar sticky-top navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@\assets\images\fridgebuddy.png" alt="Lógó" width="90" height="60" class="d-inline-block align-text-center">
        <span class="navbar-title mercury-nav-element">DiKA</span>
      </a>
      <button class="navbar-toggler mercury-nav-button" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon mercury-nav-button"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <div v-for="(menuItem, index) in menuItems" :key="index">
            <li class="nav-item">
              <!-- && menuItem.roles.includes(user.role) -->
              <router-link class="nav-link mercury-nav-element" :to="menuItem.to" v-if="menuItem.isVisible ">{{ app_language.lang == "hu" ? menuItem.title : menuItem.title_EN }}</router-link>
            </li>
          </div>
        </ul>
      </div>
      <a href="" :class="app_language.lang == 'hu' ? 'bg-hu' : 'bg-en'" class="btn" v-on:click="changeLanguage()"></a>
    </div>
  </nav>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/userstore';
    import { useAppStore } from '@/stores/appstore';

    const { status } = storeToRefs(useUserStore());
    const { app_language } = storeToRefs(useAppStore());

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
      if(app_language.value.lang == "hu"){
        localStorage.setItem("language", "en");
      }
      else
        localStorage.setItem("language", "hu");
    };
</script>

<style scoped>
nav{
    background-color: var(--ebony-clay);
}

.mercury-nav-element{
    color: var(--mercury);
}

.mercury-nav-button{
    border-color: var(--mercury);
}

.bg-hu{
  background-image: url('@/assets/images/hunflag.png');
  background-size: cover;
}

.bg-en{
  background-image: url('@/assets/images/enflag.png');
  background-size: cover;
}
</style>