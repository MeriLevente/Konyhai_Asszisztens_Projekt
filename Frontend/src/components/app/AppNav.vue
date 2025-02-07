<template>
    <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@\assets\images\fridgebuddy.png" alt="Lógó" width="90" height="60" class="d-inline-block align-text-center">
        <span class="navbar-title mercury-nav-element">Digitális Konyhai Asszisztens</span>
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
              <router-link class="nav-link mercury-nav-element" :to="menuItem.to" v-if="menuItem.isVisible ">{{ menuItem.title }}</router-link>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/userstore';

    const router = useRouter()
    const { status, user } = storeToRefs(useUserStore())

    const menuItems = computed(()=>{
      return [
        {
            title: "Nyitó oldal",
            to: '/',
            isVisible: true,
            roles: ["", "admin", "user"]
        },
        {
            title: "Bejelentkezés",
            to: '/bejelentkezes',
            isVisible: !status.value.loggedIn,
            roles: ["", "admin", "user"]
        },
    ]
    })
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
</style>