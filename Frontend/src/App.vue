<script setup lang="ts">
  import AppNav from './components/app/AppNav.vue';
  import { useAppStore } from './stores/appstore';
  import i18n from './translations';
  
  const startupLang: string | null = localStorage.getItem('lang');
  useAppStore().app_language = startupLang ?? 'hu';
  i18n.global.locale.value = startupLang == 'hu' ? 'hu' : 'en';
</script>

<template>
  <AppNav/>
  <RouterView/>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&family=Tiny5&display=swap');
  body{
    font-family: "Tiny5", sans-serif;
  }
  input{
    font-family: Funnel Sans, sans-serif;
  }
</style>
