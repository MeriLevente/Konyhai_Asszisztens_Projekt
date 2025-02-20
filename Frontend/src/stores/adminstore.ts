import type Item from "@/models/Item";
import type IRecipe from "@/models/Recipe";
import type IType from "@/models/Type";
import { defineStore } from "pinia";

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        types: <IType[]> [{
            
        }],
        type_error: "", //hiba a típus formnál vagy törlésnél

        items: <Item[]> [{
            
        }],
        units: <string[]> [
            "darab",
            "g",
            "ml"
        ],
        items_error: "", //hiba az élelmiszer formnál vagy törlésnél

        recipes: <IRecipe[]> [

        ],
        recipes_error: "",
        recipe_types: {
            types: [
                {short: "AME", hu: "Amerikai", en: "American"},
                {short: "ASI", hu: "Ázsiai", en: "Asian"},
                {short: "BRE", hu: "Reggeli", en: "Breakfast"},
                {short: "DES", hu: "Desszert", en: "Dessert"},
                {short: "HUN", hu: "Magyaros", en: "Hungarian"},
                {short: "ITA", hu: "Olasz", en: "Italian"},
                {short: "MEX", hu: "Mexikói", en: "Mexican"}
            ]
        }
    }),
    getters: {
        storeTypes(): IType[] { //majd a backendről kérdezem le, typeService-ben lévő metódus, a képeket majd mi tároljuk majd
            return this.types = [
                {id: 1, nameHU: "Zöldségek", nameEN: "Vegetables", image: "https://howdyhealth.tamu.edu/wp-content/uploads/2023/11/3-easy-ways-to-eat-more-vegetables.jpg"},
                {id: 2, nameHU: "Gyümölcsök", nameEN: "Fruits", image: "https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature_thumb.jpg?sfvrsn=7abe71fe_4"},
                {id: 3, nameHU: "Diófélék", nameEN: "Nuts", image: "https://media.npr.org/assets/img/2019/09/27/nuts-1_wide-e88dcd4e2507f22a40b752ab683d0e798f243dbb.jpg?s=1400&c=100&f=jpeg"},
                {id: 4, nameHU: "Tejtermékek", nameEN: "Dairy", image: "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2020/10/shutterstock_1232966839.jpg"},
                {id: 5, nameHU: "Húsok és tojás", nameEN: "Meats and egg", image: "https://cdn11.bigcommerce.com/s-iz8lky8j1x/product_images/uploaded_images/raw-meat-in-a-restaurant-kitchen.jpg"},
                {id: 6, nameHU: "Egyéb", nameEN: "Other", image: "https://img.freepik.com/free-photo/various-raw-pasta-with-bottle-olive-oil-marble-table_114579-18147.jpg"},
            ]
        },
        storeItems(): Item[] {
            return this.items = [
                {id: 1, nameHU: "Paradicsom", nameEN: "Tomato", typeId: 1,unit: "darab" , image: "https://gallery.yopriceville.com/Free-Clipart-Pictures/Vegetables-PNG/Tomato_Transparent_PNG_Clip_Art_Image"},
                {id: 20, nameHU: "Tej", nameEN: "Milk",  typeId: 4, unit: "ml" , image: "https://static.vecteezy.com/system/resources/thumbnails/041/931/242/small_2x/breakfast-meal-objects-milk-drink-clip-art-cartoon-isolated-free-png.png"},
                {id: 9, nameHU: "Alma", nameEN: "Apple",  typeId: 2, unit: "darab" , image: "https://gallery.yopriceville.com/Free-Clipart-Pictures/Fruit-PNG/Apple_Transparent_PNG_Clip_Art_Image"},
                {id: 17, nameHU: "Mogyoró", nameEN: "Nut",  typeId: 3, unit: "g" , image: "https://pngfre.com/wp-content/uploads/Peanut-11-1024x758.png"},
                {id: 27, nameHU: "Csirke", nameEN: "Chicken",  typeId: 5, unit: "g" , image: "https://pngfre.com/wp-content/uploads/chicken-poster.png"},
                {id: 34, nameHU: "Étolaj", nameEN: "Oil",  typeId: 6, unit: "ml" , image: "https://static.vecteezy.com/system/resources/thumbnails/024/851/117/small_2x/a-bottle-of-palm-kernel-cooking-oil-on-a-transparent-background-png.png"}
            ]
        },
        storeRecipes(): IRecipe[]{
            return this.recipes = [
                {id: 1, nameHU: "Bolognai tészta", nameEN: "Bolognese pasta", descriptionHU: "A zöldségeket apró darabokra vágjuk és egy serpenyőbe rakjuk főni 60 percre.#Hozzárakjuk a paradicsomot, amit leturmixolunk először és fűszerezzük.#A tésztát forralt vízben elkészítjük.#A tésztára öntünk a szószból, és sajttal tálaljuk.", descriptionEN: "Cut the vegetables into small pieces and put them in a pan to cook for 60 minutes.#Add the tomatoes, which we first blend and season.#Prepare the dough in boiled water.#Pour the sauce over the pasta and serve with cheese.", type: "ITA", difficulty: 5, time: 80, image: "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2021/06/THUMB-LINK-2020-2.jpg?im=AspectCrop=(16,9);Resize,width=742;"}
            ]
        }
    }
});