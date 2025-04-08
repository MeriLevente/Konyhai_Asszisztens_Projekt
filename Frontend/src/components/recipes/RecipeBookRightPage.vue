<script setup lang="ts">
    import type IStoredItem from '@/models/StoredItem';
    import { useAppStore } from '@/stores/appstore';
    import { useUserStore } from '@/stores/userstore';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRouter } from 'vue-router';
    const { appLanguage } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["recipe"]);
    let storedIngredients = ref<IStoredItem[]>([]);
    let enoughInStore = ref<boolean>(true);
    let loadingCooking = ref<boolean>(false);
    const router = useRouter();

    onMounted((): void => {
        useUserStore().getStoredItems(true)
        .then((): void => {
            if (props.recipe.ingredients.length > 0) {
                storedIngredients.value = useUserStore().getRecipeIngredientsInMyKitchen(props.recipe.ingredients);
            };
            useUserStore().storageLoading = false;
        })
        .catch((err: string): void => {
            console.error(err);
            useUserStore().storageLoading = false;
        }); 
    });

    const isEnoughQuantity = (storedQuantity: number, ingredientQuantity: number): void => {
        if (enoughInStore.value) {
            if (storedQuantity < ingredientQuantity)
                enoughInStore.value = false;
        };
    };

    const removeUsedItems = (): void => {
        loadingCooking.value = true;
        const myItems: IStoredItem[] = [...storedIngredients.value];
        for (let i = 0; i < myItems.length; i++) {
            let storedItem: IStoredItem = myItems[i];
            useUserStore().updateQuantity({...storedItem, quantity: myItems[i].quantity - props.recipe.ingredients[i].quantity}, 'reduce');  
        }
        loadingCooking.value = false;
        alert("Bon Appetit! :)");
        router.push("/recipes");
    };
</script>

<template>
    <div class="my-3 page-content">
        <div style="float: left;">
            {{ `${t("difficulty")}: ${recipe.difficulty} / 10`}}
        </div>
        <div style="float: right;">
            {{ `${t("time")}: ${recipe.time} `}}
        </div>
        <h3 class="pt-1">{{ t("ingredients" ) + ` (${t("inmystore")})`}}</h3>
        <ul>
            <li v-for="(ingr, index) in recipe?.ingredients">
                {{ `${appLanguage == 'hu' ? ingr.item.name : ingr.item.name_EN}, ${ingr.quantity} ${t(ingr.item.unit)} ` }}
                (
                <span v-if="storedIngredients[index]" 
                    v-on="isEnoughQuantity(storedIngredients[index].quantity, ingr.quantity)"
                    :class="storedIngredients[index].quantity < ingr.quantity ? 'text-danger' : ''">
                    {{`${storedIngredients[index].quantity} ${t(ingr.item.unit)}`}}
                </span>
                )
            </li>
        </ul>
        <h3>{{ t("prep" )}}</h3>
        <ol>
            <li class="mt-2" v-if="appLanguage == 'hu'" v-for="step in recipe?.description.split('#')">
                {{ step }}
            </li>
            <li class="mt-2" v-if="appLanguage == 'en'" v-for="step in recipe?.description_EN.split('#')">
                {{ step }}
            </li>
        </ol>
        <button class="cook-btn" :disabled="!enoughInStore || props.recipe.ingredients.length == 0" v-on:click="removeUsedItems">
            {{ t("letmecook") }}
            <span v-if="loadingCooking" class="spinner-border spinner-border-sm text-center"></span>
        </button>
    </div>
</template>

<style lang="css" scoped>
    h3 {
        border-bottom: 2px solid black;
        margin-top: 3.5rem;
    }
    button {
        margin-left: 40%;
        background-color: var(--ebony-clay);
        color: white;
    }
    .page-content {
        padding-top: 3.1rem;
    }
    .cook-btn:disabled {
        opacity: 0.4;
    }
</style>