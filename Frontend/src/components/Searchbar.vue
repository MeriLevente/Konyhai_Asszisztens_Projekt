<script setup lang="ts">
    import { ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const searchedWord = ref<string>();
    const emit = defineEmits(["search", "showPaginated"]);
    const props = defineProps(["viewerRole", "searchInAction"]);

    const search = (): void => {
        emit("search", searchedWord.value);
    };

    const showPaginated = (): void => {
        emit("showPaginated");
    };
</script>

<template>
    <div>
        <form @submit.prevent="search()">
            <div class="form-floating input-area">
                    <input type="text" name="search" id="search" class="form-control" v-model="searchedWord">
                        <button type="submit" class="search-icon" style="display: inline;">
                            <span class="bi bi-search"></span>
                        </button>
                    </input>
                <label for="search">{{ t("search") }}</label>
            </div>
        </form>
        <div class="d-flex justify-content-center" v-if="searchInAction">
            <button v-on:click="showPaginated" v-if="props.viewerRole == 'admin'" class="all-btn w-50 ms-5 mt-1 mb-5">{{ t("all") }}</button>
        </div>
    </div>
     
</template>

<style lang="css" scoped>
   .all-btn {
        color: white;
        background-color: var(--ebony-clay);
        border-radius: 20px;
   }
</style>