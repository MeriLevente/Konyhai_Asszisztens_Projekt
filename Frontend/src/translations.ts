import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    legacy: false,
    locale: 'hu',
    fallbackLocale: 'hu',
    messages: {
        'hu': {
            //HomeView
            greeting: "Szervusz",
            save: "Mentés",
            cancel: "Mégse",

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

            //AdminView
            admin_h1: "Adminisztráció",
            edit_type: "Élelmiszer típusok",
            admin_reg: "Admin regisztráció",
            edit_recipes: "Receptek",
            edit_items: "Élelmiszerek",
            add_new: "Új",
            close: "Bezár",
            no_data: "Nincsenek még adatok!",

            //Edit types
            id: "Id",
            name: "Név",
            image: "Kép",

            //Edit items
            unit: "Mértékegység",
            type: "Típus",

            //Edit recipes
            difficulty: "Nehézség",
            time: "Elk. idő (perc)",
            recipe_editor: "Recept írás",
            steps: "Lépések",
            input_step: "Lépés felvétele/módosítása",
            input_step_rules: "Max. 4 lépés, legyen egyszerű!",
            step: "Lépés",
            language: "Nyelv",
            hu: "Magyar",
            en: "Angol",
            ingredients: "Hozzávalók",

            quantity: "Mennyiség",
            darab: "darab",
            g: "g",
            ml: "ml"
        },
        'en': {
            //HomeView
            greeting: "Hi there",
            save: "Save",
            cancel: "Cancel",

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

            //AdminView
            admin_h1: "Administration",
            edit_type: "Item types",
            admin_reg: "Admin registration",
            edit_recipes: "Recipes",
            edit_items: "Items",
            add_new: "New",
            close: "Close",
            no_data: "No data found yet!",

            //Edit types
            id: "Id",
            name: "Name",
            image: "Image",

            //Edit items
            unit: "Unit",
            type: "Type",

            //Edit recipes
            difficulty: "Difficulty",
            time: "Prep. time (min)",
            recipe_editor: "Recipe Editor",
            steps: "Steps",
            input_step: "Add/modify step",
            input_step_rules: "Max. 4 steps, make it simple!",
            step: "Step",
            language: "Language",
            hu: "Hungarian",
            en: "English",
            ingredients: "Ingredients",

            quantity: "Quantity",
            darab: "piece",
            g: "g",
            ml: "ml"
        }
    }
});

export default i18n;