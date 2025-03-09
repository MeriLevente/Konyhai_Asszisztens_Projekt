<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <h2 class="display-6 about-h2">{{ t('abouth2') }}</h2>
    <div class="question-div p-2">
        <h6 class="about-h6">
            <i class="bi bi-question-circle-fill"></i>
            {{ t('abouth6') }}
            <i class="bi bi-question-circle-fill"></i></h6>
    </div>
    <ul>
        <li><p class="about-p">{{ t('aboutParag') }}</p></li>
        <li><p class="about-p">{{ t('aboutParag2') }}</p></li>
    </ul>
</template>

<style lang="css">
    .about-h2, .about-h6 {
        text-align: center;
        font-weight: bold;
    }
    .question-div {
        border: var(--charade) 1px solid;
        border-radius: 20px;
        background-color: yellow; 
    }

    @media only screen and (max-width: 600px) {
        .about-p {
            font-size: 12px;
        }
        .about-h6 {
            font-size: 12px;
        }    
    }
</style>