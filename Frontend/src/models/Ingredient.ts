import type Item from "./Item";

export default interface Ingredient {
    recipe_id?: number
    item: Item
    quantity: number
}