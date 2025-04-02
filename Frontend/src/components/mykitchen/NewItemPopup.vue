<script setup lang="ts">
    import { useAppStore } from '@/stores/appstore';
    import { useTypeStore } from '@/stores/typestore';
    import { useItemStore } from '@/stores/itemstore';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import type Item from '@/models/Item';
    import { useUserStore } from '@/stores/userstore';
    import type StoredItem from '@/models/StoredItem';
    const { app_language } = storeToRefs(useAppStore());
    const { t } = useI18n();
    const props = defineProps(["method"]);
    const emit = defineEmits(["close"]);
    const selectedTypeId = ref<number | null>();
    const selectedItem = ref<Item | null>();
    const itemQuantity = ref<number | null>();
    let errorMessage = ref<string | null>("");

    const closePopUp = (): void => {
        emit("close");
    };

    const save = (): void => {
        const request: StoredItem = {
            userId: useUserStore().user!.id!,
            itemId: selectedItem.value?.id,
            quantity: itemQuantity.value!
        };
        if(!useUserStore().storedItems.find(x=> x.itemId == request.itemId)){
            if (request.quantity > 0 && request.quantity <= 10000) {
                useUserStore().updateQuantity(request, "add").then(()=>{
                    errorMessage.value = ""
                    emit("close");
                });
            } else {
                errorMessage.value = app_language.value == "hu" ? "Helytelen mennyiség!" : "Invalid quantity!";
            }
        } else {
            errorMessage.value = app_language.value == "hu" ? "Már van ilyen a konyhádban!" : "Item already in your kitchen!";
        }
    };
</script>

<template>
    <h2 class="text-center popup-h2 mb-3">{{ t("newitem") }}</h2>
    <div class="form-floating mb-3">
        <select name="types" id="types" class="form-control" v-model="selectedTypeId" v-on:change="selectedItem = null; itemQuantity = null" v-on:focus="errorMessage = ''">
            <option v-for="type in useTypeStore().types" :value="type.id!">
                {{ app_language == "hu" ? type.name : type.name_EN }}
            </option>
        </select>
        <label for="types">{{t("type")}}</label>
    </div>
    <div class="form-floating mb-3">
        <select id="item" class="form-control"
            v-model="selectedItem" v-bind:disabled="!selectedTypeId"
            v-on:click="useItemStore().getItemsByTypeId(selectedTypeId!)"
            v-on:focus="errorMessage = ''">
            <option v-for="item in useItemStore().items" :value="item">{{app_language == 'hu' ? item.name : item.name_EN}}</option>
        </select>
        <label for="items">{{ t('edit_items') }}</label>
    </div>
    <div class="row mt-4">
        <div class="col-8">
            <div class="row">
                <div class="col-10">
                    <div class="form-floating mb-2">
                        <input type="number" min="1" max="10000" class="form-control" v-model="itemQuantity" v-bind:disabled="!selectedItem" v-on:focus="errorMessage = ''"/>
                        <label for="quantity">{{ t("quantity") }}</label>
                    </div> 
                </div>
                <div class="col-2 pt-3 ps-0">
                    <span class="unitSpan" v-if="selectedItem">{{ t(selectedItem!.unit) }}</span>
                </div>
            </div>
            <p class="text-danger d-flex justify-content-center my-2">
                {{ errorMessage }}
            </p>
            <div class="d-flex justify-content-center">
                <button class="btn btn-success me-3" v-on:click="save">{{ t("save") }}</button>
                <button class="btn btn-danger" v-on:click="closePopUp">{{ t("cancel") }}</button>
            </div>
        </div>
        <div class="col-4 d-flex justify-content-center">
            <img src="@\assets\images\fridgebuddy.png" alt="Fride buddy" class="newitem-img">
        </div>
    </div>                 
</template>

<style lang="css">
    .popup-h2 {
        border-bottom: solid 1px solid white;
    }

    .unitSpan {
        border: 0.5px white solid;
        background-color: var(--ebony-clay);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        padding: 0.35rem;
        border-radius: 90px;
    }

    .newitem-img {
        height: 9rem;
        width: 9rem;
    }
</style>