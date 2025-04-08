import type Ingredient from "./Ingredient";

export default interface IRecipe {
    id?: number | undefined
    name: string
    name_EN: string
    description: string
    description_EN: string
    type: string
    difficulty: number
    time: number
    image: string
    ingredients: Ingredient[]
};