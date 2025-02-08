import './assets/css/main.css'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    legacy: false,
    locale: 'hu',
    fallbackLocale: 'hu',
    messages: {
        'hu': {
            greeting: "Szervusz"
        },
        'en': {
            greeting: "Hi there"
        }
    }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
