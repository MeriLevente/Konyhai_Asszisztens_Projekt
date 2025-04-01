import type Item from "./Item";

export default interface Ingredient {
    recipeId: number
    item: Item
    quantity: number
}