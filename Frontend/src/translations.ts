import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    legacy: false,
    locale: 'hu',
    fallbackLocale: 'hu',
    messages: {
        'hu': {
            //HomeView
            greeting: "Szervusz",

            //NotFoundView
            notfound_h1: "Hoppá! Valami hiba történt!",
            notfound_text: "A keresett oldal nem található! Győződj meg róla, hogy nem írtad el az oldal címét!",
        },
        'en': {
            //HomeView
            greeting: "Hi there",

            //NotFoundView
            notfound_h1: "Oops! Something went wrong!",
            notfound_text: "The site cannot be found! Make sure you haven't misstyped the site address!",
        }
    }
});

export default i18n;