<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n(); //translation függvény
</script>

<template>
    {{ t('greeting') }}
</template>

<style lang="css">

</style>