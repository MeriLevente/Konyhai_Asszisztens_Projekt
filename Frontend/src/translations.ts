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

            //LoginView, RegisterView
            login_h1: "Bejelentkezés",
            register_h1: "Regisztrálás",
            name_form: "Név",
            password_form: "Jelszó",
            confirm_password_form: "Jelszó megerősítése",
            go_register: "Nincs még profilod? Regisztrálj itt!",
            confirm_pass_incorrect: "A két jelszó nem egyezik!",

            //AdminView
            admin_h1: "Adminisztráció",
            edit_type: "Élelmiszer típusok",
            admin_reg: "Admin regisztráció",
            edit_recipes: "Receptek",
            edit_items: "Élelmiszerek",
            add_new: "Új felvétele",

            //Edit types
            name: "Név",
            image: "Kép",
        },
        'en': {
            //HomeView
            greeting: "Hi there",

            //NotFoundView
            notfound_h1: "Oops! Something went wrong!",
            notfound_text: "The site cannot be found! Make sure you haven't misstyped the site address!",

            //LoginView, RegisterView
            login_h1: "Login",
            register_h1: "Register",
            name_form: "Name",
            password_form: "Password",
            confirm_password_form: "Confrim password",
            go_register: "Don't have an account yet? Register here!",
            confirm_pass_incorrect: "The passwords doesn't match!",

            //AdminView
            admin_h1: "Administration",
            edit_type: "Item types",
            admin_reg: "Admin registration",
            edit_recipes: "Recipes",
            edit_items: "Items",
            add_new: "Add new",

            //Edit types
            name: "Name",
            image: "Image",
        }
    }
});

export default i18n;