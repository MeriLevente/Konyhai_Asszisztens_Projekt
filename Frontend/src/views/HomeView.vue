<script setup lang="ts">
    import AboutItems from '@/components/homepage/AboutItems.vue';
    import AboutMe from '@/components/homepage/AboutMe.vue';
    import AboutProfile from '@/components/homepage/AboutProfile.vue';
    import AboutRecipes from '@/components/homepage/AboutRecipes.vue';
    import { useUserStore } from '@/stores/userstore';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();

    const info_togglers: string[] = ["about_me", "profile", "store_items", "recipes"];
    const toggled_Data = ref<string[]>(["about_me"]);

    const toggleInfo = (toggler: string): void => {
        if(!toggled_Data.value.includes(toggler))
            toggled_Data.value.push(toggler);
        else
            toggled_Data.value.splice(toggled_Data.value.indexOf(toggler), 1);
    };
</script>

<template>
    <main class="my-3 mx-3">
        <div class="home-div p-4 d-flex justify-content-center">
            <div>
                <img src="@/assets/images/fridgebuddy.png" alt="Fridge logo" class="logo-img">
            </div>
            <div class="pt-5">
                <h1 class="greeting">{{ `${t('greeting')}, ${useUserStore().user?.name ?? t("stranger")}!` }}</h1>
                <h5 class="greeting">{{ t("greeting2") }}</h5>
            </div>
        </div>
        <div class="home-div mt-2 p-2">
            <h5 class="greeting" style="text-align: center;">{{ t('know_more') }}</h5>
            <div class="d-flex justify-content-center" v-for="toggler in info_togglers" v-on:click="toggleInfo(toggler)">
                <div class="m-2 info-toggler">
                    <i class="toggler-inline bi me-3 ms-1" :class="!toggled_Data.includes(toggler) ? 'bi-caret-down-fill' : 'bi-caret-up-fill'"></i>
                    <p class="toggler-inline">{{ t(toggler) }}</p>
                    <div v-if="toggled_Data.includes(toggler)" class="mx-2 dotted-bottom"></div>
                    <div class="mx-3 mt-2" v-if="toggled_Data.includes(toggler)">
                        <div>
                            <AboutMe v-if="toggler == 'about_me'"/>
                            <AboutProfile v-if="toggler == 'profile'"/>
                            <AboutItems v-if="toggler == 'store_items'"/>
                            <AboutRecipes v-if="toggler == 'recipes'"/>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </main>
</template>

<style lang="css" src="@/assets/css/home.css"></style>