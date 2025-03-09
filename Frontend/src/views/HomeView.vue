<script setup lang="ts">
    import AboutItems from '@/components/homepage/AboutItems.vue';
    import AboutMe from '@/components/homepage/AboutMe.vue';
    import AboutProfile from '@/components/homepage/AboutProfile.vue';
    import AboutRecipes from '@/components/homepage/AboutRecipes.vue';
    import { useUserStore } from '@/stores/userstore';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n(); //translation függvény

    const info_togglers: string[] = ["about_me", "profile", "store_items", "recipes"];
    const toggled_Data = ref<string[]>([]);

    const toggleInfo = (toggler: string): void => {
        if(!toggled_Data.value.includes(toggler))
            toggled_Data.value.push(toggler);
        else
            toggled_Data.value.splice(toggled_Data.value.indexOf(toggler), 1);
    };
</script>

<template>
    <div class="my-3 mx-3">
        <div class="home-div p-4 d-flex justify-content-center">
            <div style="display: inline-block;">
                <img src="@/assets/images/fridgebuddy.png" alt="Fridge logo" class="logo-img">
            </div>
            <div style="display: inline-block;" class="pt-5">
                <h1 class="greeting">{{ `${t('greeting')}, ${useUserStore().user.name ?? t("stranger")}!` }}</h1>
                <h5 class="greeting">{{ t("greeting2") }}</h5>
            </div>
        </div>
        <div class="home-div mt-2 p-2">
            <h5 class="greeting" style="text-align: center;">{{ t('know_more') }}</h5>
            <div class="d-flex justify-content-center" v-for="toggler in info_togglers" v-on:click="toggleInfo(toggler)">
                <div class="m-2 info-toggler">
                    <i class="bi me-3 ms-1" :class="!toggled_Data.includes(toggler) ? 'bi-caret-down-fill' : 'bi-caret-up-fill'" style="display: inline;"></i>
                    <p style="display: inline;">{{ t(toggler) }}</p>
                    <div v-if="toggled_Data.includes(toggler)" style="border-bottom: dotted var(--charade) 4px;" class="mx-2"></div>
                    <div class="mx-3 mt-2" v-if="toggled_Data.includes(toggler)" :class="`toggle-${toggler}`">
                        <div>
                            <AboutMe v-if="toggler == info_togglers[0]"/>
                            <AboutProfile v-if="toggler == info_togglers[1]"/>
                            <AboutItems v-if="toggler == info_togglers[2]"/>
                            <AboutRecipes v-if="toggler == info_togglers[3]"/>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>

<style lang="css">
    .greeting {
        font-weight: bold;
        color: var(--charade);
    }
    h1.greeting {
        font-size: 2.5rem;
    }
    h5.greeting {
        font-size: 1.2rem;
    }
    .logo-img {
        width: 13rem;
        height: 13rem;
    }
    .home-div {
        background-color: rgba(128, 206, 245, 0.5);
        border: 0.2rem solid var(--ebony-clay);
        border-radius: 20px;
    }
    .info-toggler {
        background-color: var(--mercury);
        color: var(--charade);
        border: 2.5px solid var(--charade);
        border-radius: 10px;
        width: 90%;
        font-weight: bold;
        font-size: 1.2rem;
        cursor: pointer;
    }

    @media only screen and (max-width: 600px) {
        .logo-img {
            width: 7rem;
            height: 7rem;
            margin-top: 2rem;
        }
        h1.greeting {
            font-size: 1.8rem;
        }
        h5.greeting {
            font-size: 0.7rem;
        } 
    }
</style>