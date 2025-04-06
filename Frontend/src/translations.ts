import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    legacy: false,
    locale: 'hu',
    fallbackLocale: 'hu',
    reloadOnLanguageChange: false,
    messages: {
        'hu': {
            //HomeView
            greeting: "Szervusz",
            greeting2: "DiKA vagyok, a te Digitális Konyhai Asszisztensed.",
            save: "Mentés",
            cancel: "Mégse",
            stranger: "ismeretlen",
            know_more: "Tudj meg többet rólam",
            about_me: "Rólam",
            profile: "Készíts profilt",
            store_items: "Légy a konyhád úra",
            recipes: "Egyszerű receptek neked",

            //About me
            abouth2: "Szia, DiKA vagyok!",
            abouth6: "Te sem vagy a konyhaördöge? Se baj, engem, azért készítettek, hogy segítsek neked!",
            aboutParag: "Menedzseld a konyhádban lévő élelmiszereket. Bárhol, és bármikor elérheted a konyhád tartalmát, és nem kell találgatnod, hogy mi" +
                        " is van otthon?! Így megkönnyítve a dolgodat a boltban.",
            aboutParag2: "Segítek, hogy konyhádat modernizáld. Otthon tárolt élelmiszereidet megtekintheted weboldalunkon vagy mobilalkalmazásunkban," +
                         "új dolgaidat rögzítheted, illetve kitörölheted adatbázisunkból. Így teljes irányításod lehet konyhád tartalma felett.",

            //About profile
            about_profileh2: "Csatlakozz most!",
            about_profileParag: "Regisztrálj először és azonnal elérhetővé válik neked a DiKA által nyújtott szolgáltatások.",
            about_profileParag2: "Gyorsan és könnyedén csinálhatsz egy profilt, és részese lehetsz a DiKA nagyszámú közösségének.",
            clickme: "Kattints ide és regisztrálj",

            //About items
            about_itemsh2: "Menedzseld a konyhád!",
            about_itemsParag: "Termékeidet mágikus DiKAMON-okként gyűjtheted. Gyűjtsd össze az összeset és légy a DiKAMON bajnok!",
            about_itemsParag2: "A konyhád tartalmának menedzselése sosem volt ilyen mókás és egyszerű. " + 
                                "Nem unalmas, mint a valóságban, hanem olyan ,mint egy videójátékban!",
            clickmeTakeMeThere: "Vigyél oda",
            clickmeRegisterFirst: "Először regisztrálj",

            //About recipes
            about_recipesh2: "Egyszerű receptek kezdőknek!",
            about_recipesParag: "Nem vagy Gordon Ramsey? Ne félj, a tehetséges fejlesztőink több egyszerű és gyors receptet írtak számodra!",
            about_recipesParag2: "A receptek csak olyan élelmiszereket tartalmaznak, amelyeket DiKA-ban tudsz tárolni vagy könnyen beszerezheted.",
            about_recipesParag3: "A receptek 4 lépésből állnak, négy egyszerű lépésből, amit bárki tud követni.",
            about_recipesParag4: "Tehát mire vársz? Meg tudod csinálni!, főzzünk/süssünk együtt!",
            about_recipesLink: "Recept könyv",

            //NotFoundView
            notfound_h1: "Hoppá! Valami hiba történt!",
            notfound_text: "A keresett oldal nem található! Győződj meg róla, hogy nem írtad el az oldal címét!",

            //LoginView, RegisterView
            login: "Bejelentkezés",
            logout: "Kijelentkezés",
            register: "Regisztrálás",
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
            no_data: "Nem találhatóak adatok!",
            admin_reg_success: "Admin profil sikeresen regisztrálva!",
            deleteYesNo: "Biztosan törölni szeretné a(z)",

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
            prep: "Elkészítés",

            quantity: "Mennyiség",
            darab: "darab",
            g: "g",
            ml: "ml",

            toHome: "Vissza a főoldalra",

            //ItemsView
            mykitchen: "Konyhám",
            search: "Keresés",
            showAll: "Mutasd mind",
            titleCatchphrase: "Szerezd meg hát mind!",
            noitems: "A manóba, nem találtam semmilyen élelmiszert!",
            newitem: "Vegyél fel egy új DiKAMON-t a konyhádba!",
            QuantityChanger: "Mennyiség módosító",
            delete: "Lenulláz",

            //RecipesView
            recipesTitle: "Receptek",
            hour: "ó",
            minute: "perc",
            recipeimgtext: "A kép csak illusztráció!",
            letmecook: "Elkészítem!",
            all: "Mind",
            inmystore: "a konyhámban"
        },
        'en': {
            //HomeView
            greeting: "Hi there",
            save: "Save",
            cancel: "Cancel",
            stranger: "stranger",
            greeting2: "I'm DiKA, your Digital Kitchen Assistant",
            know_more: "Know more about me",
            about_me: "About me",
            profile: "Create a profile",
            store_items: "Manage your kitchen",
            recipes: "Simple recipes for you",

            //About me
            abouth2: "Hi, DiKA is the name!",
            abouth6: "Are you also bad in the kitchen? Don't worry, I was made to help you!",
            aboutParag: "Manage the items in your kitchen. You can access your food from anywhere and anytime, you don't have to blindly guess, what" +
                        " you have at home?!",
            aboutParag2: "I help you modernize your kitchen. You can view your stored items at our website or at our mobile app," +
                         "you can register new items, or delete already existing items from our database. Thus having full control over your kitchen!",

            //About profile
            about_profileh2: "Join now!",
            about_profileParag: "Register now and all the services of DiKA will be available for you.",
            about_profileParag2: "Making a profile is fast and simple, so register now and be a part of the growing DiKA community.",
            clickme: "Click me and register",

            //About items
            about_itemsh2: "Manage your kitchen!",
            about_itemsParag: "You can store your items as magical creatures, called DiKAMONs. Collect all of them and be the DiKAMON champion!",
            about_itemsParag2: "Managing your kitchen was never this easy and fun! Unlike in real life, it's not boring. It feels like a videogame.",
            clickmeTakeMeThere: "Take me there",
            clickmeRegisterFirst: "Register first",

            //About recipes
            about_recipesh2: "Simple recipes for beginners!",
            about_recipesParag: "You are not Gordon Ramsey? Don't worry, our talented devs have written a ton of simple and quick recipes for you!",
            about_recipesParag2: "All recipes contain ingredients that you can store in your virtual kitchen or you can easily buy",
            about_recipesParag3: "The recipes only have 4 steps, four simple steps that everyone can follow",
            about_recipesParag4: "So what are you waiting for? You can do it, let's cook together!",
            about_recipesLink: "Recipe book",

            //NotFoundView
            notfound_h1: "Oops! Something went wrong!",
            notfound_text: "The site cannot be found! Make sure you haven't misstyped the site address!",

            //LoginView, RegisterView
            login: "Login",
            logout: "Logout",
            register: "Register",
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
            no_data: "No data found!",
            admin_reg_success: "Admin profile successfully registered!",
            deleteYesNo: "Do you want to delete",

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
            prep: "Directions",

            quantity: "Quantity",
            darab: "piece",
            g: "g",
            ml: "ml",

            toHome: "Back to the homepage",

            //ItemsView
            mykitchen: "My Kitchen",
            search: "Search",
            showAll: "Show all",
            titleCatchphrase: "Gotta catch'em all!",
            noitems: "Oh no, I couldn't find any items!",
            newitem: "Register a new DiKAMON to your kitchen!",
            QuantityChanger: "Quantity Changer",
            delete: "Make it 0",

            //RecipesView
            recipesTitle: "Recipes",
            hour: "h",
            minute: "min",
            recipeimgtext: "Image is only an illustration!",
            letmecook: "Let me cook!",
            all: "All",
            inmystore: "my items"
        }
    }
});

export default i18n;