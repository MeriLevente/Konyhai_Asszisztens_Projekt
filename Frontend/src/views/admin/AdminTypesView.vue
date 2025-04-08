<script setup lang="ts">
    import Paginator from '@/components/Paginator.vue';
    import Searchbar from '@/components/Searchbar.vue';
    import TypeModal from '@/components/modals/TypeModal.vue';
    import type IType from '@/models/Type';
    import { useAppStore } from '@/stores/appstore';
    import { useTypeStore } from '@/stores/typestore';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useTypeStore();
    const searchInAction = ref<boolean>(false);
    const { typesAllLength } = storeToRefs(store);
    const maxLength = ref<number>(Number(sessionStorage.getItem("typesMaxLength")) ?? useTypeStore().types.length);
    const loading = ref<boolean>(false);
    const data = ref<IType | null>();

    onMounted((): void => {
        if (!sessionStorage.getItem("typesMaxLength")) {
            useTypeStore().getAllTypesLength().then((res: number): void => {
                maxLength.value = res;
            });
        };
    });

    const addType = (): void => {
        data.value = {
            name: "",
            name_EN: "",
            image: ""
        };
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const editType = (selected: IType): void => {
        data.value = {
            id: selected.id,
            name: selected.name,
            name_EN: selected.name_EN,
            image: selected.image
        };
        document.getElementsByTagName('body')[0].classList.add('disable-scrolling');
    };

    const deleteType = (selected: IType): void => {
        if (confirm(`${t("deleteYesNo")} ${useAppStore().appLanguage == "hu" ? selected.name : selected.name_EN}?`) == true)
            store.deleteType(selected)
                .catch((err: string): void => {
                    alert(err);
                });
    };

    const saveData = (type: any): void => {
        store.saveType(type.value)!
            .then((): void => {
                closeModal();
            })
            .catch(()=> {});
    };

    const closeModal = (): void => {
        store.typesError.hu = "";
        store.typesError.en = "";
        data.value = null;
        document.getElementsByTagName('body')[0].classList.remove('disable-scrolling');
    };

    const loadTypesPaginated = (paginatorValues: {from: number, to: number}): void => {
        loading.value = true;
        store.loadPaginated(paginatorValues.from, paginatorValues.to)
            .then((): void => {
                loading.value = false;
            })
            .catch((err: string): void => {
                console.error(err); 
                loading.value = false;
            });
    };

    const search = (searchedWord: string): void => {
        loading.value = true;
        store.searchTypes(searchedWord)
            .then((): void => {
                searchInAction.value = true;
                loading.value = false;
            })
            .catch((err: string): void => {
                alert(err);
                loading.value = false;
            });
    };
</script>

<template>
    <div class="background" v-if="data"></div>
    <main class="container my-5">
        <div class="row">
            <RouterLink class="back-to-admin" to="/admin">Admin >> {{ t('edit_type') }}</RouterLink>
        </div>
        <div class="row">
            <h1 class="display-3 text-center">{{t('edit_type')}}</h1>
        </div>
        <div class="row d-flex justify-content-center">
            <Searchbar v-on:search="search" v-on:show-paginated="loadTypesPaginated({from: 0, to: 6}); searchInAction = false;" 
                class="w-50" :viewer-role="'admin'" :searchInAction="searchInAction"/>
        </div>
        <div class="row my-5 d-flex justify-content-center" v-if="loading">
            <span class="spinner-border spinner-border-bg text-center"></span>
        </div>
        <div class="row my-2" v-if="!loading">  
            <div class="col-12">
                <TypeModal :data="data" v-if="data" v-on:save-data="saveData" v-on:close-modal="closeModal"/>
                <div v-if="store.types.length == 0" class="nodata-div w-50 mx-auto p-3">
                    <h3 class="text-center">{{ t("no_data") }}</h3>
                </div>

                <div class="table-responsive">
                    <table class="admin-table" v-if="store.types.length > 0">
                        <thead>
                            <tr>
                                <th style="width: 10%;">
                                    <span class="btn btn-success m-1" v-on:click="addType">
                                        {{ t("add_new") }}
                                    </span>
                                </th>
                                <th class="text-center" style="width: 1%;">Id</th>
                                <th class="text-center" style="width: 10%;">{{ t("name") }} (hu)</th>
                                <th class="text-center" style="width: 10%;">{{ t("name") }} (en)</th>
                                <th style="width: 20%;">{{ t("image") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(type,index) in store.types" :key="index">
                                <td>
                                    <span class="btn btn-primary p-2 m-1 table-btn"  v-on:click="editType(type)">
                                        <i class="bi bi-pencil d-flex justify-content-center"></i>
                                    </span>
                                    <span class="btn btn-danger p-2 table-btn" v-on:click="deleteType(type)">
                                        <i class="bi bi-trash d-flex justify-content-center"></i>
                                    </span>
                                </td>
                                <td class="text-center pt-3">{{ type.id }}</td>
                                <td class="text-center pt-3">{{ type.name }}</td>
                                <td class="text-center pt-3">{{ type.name_EN }}</td>
                                <td><img class="td-image" :src="type.image" alt="image"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <Paginator v-if="!searchInAction" :max-length="typesAllLength"
            v-on:paginator-triggered="loadTypesPaginated" :page="'admin_types'"/>
    </main>
</template>

<style lang="css" src="@/assets/css/admin.css"/>