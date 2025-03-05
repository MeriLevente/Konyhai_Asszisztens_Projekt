import type IFormResponse from "@/models/FormResponse"
import type Ingredient from "@/models/Ingredient"

export default class RecipeValidation {
    private static RecipeAllFilled
        (name: string, nameEn: string, image: string, type: string, steps: string, stepsEn: string) : IFormResponse {
            if(!name || !nameEn || !image || !type || !steps || !stepsEn)
                return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
            else
                return {isError: false}
    };
    private static DifficultyIsCorrect(difficulty: number) : IFormResponse {
        if(Number(difficulty) <= 0 || Number(difficulty) > 10)
            return {isError: true, message: "A nehézség 1 és 10 között legyen!", messageEn: "Difficulty must be between 1 and 10!"}
        else
            return {isError: false}
    };
    private static TimeIsCorrect(time: number) : IFormResponse {
        if(Number(time) <= 0 || Number(time) > 10080)
            return {isError: true, message: "Az elkészítési idő túl hosszú vagy helytelen!", messageEn: "The prep time is too long or incorrect!"}
        else
            return {isError: false}
    };
    private static IngredientsIsCorrect(ingredients: Ingredient[]): IFormResponse {
        if(ingredients.length == 0 || ingredients.length > 20)
            return {isError: true, message: "Hozzávalók felvétetele és maximum 20 lehet!", messageEn: "Adding ingredients is required and it must be less than 20!"}
        else
            return {isError: false}
    };
    public static RecipeIsCorrect
    (name: string, nameEn: string, difficulty: number, time: number,
     image: string, type: string, steps: string, stepsEn: string, ingredients: Ingredient[]
    ) : IFormResponse 
    {
        const validationMethods: IFormResponse[] = [
            this.RecipeAllFilled(name, nameEn, image, type, steps, stepsEn),
            this.DifficultyIsCorrect(difficulty),
            this.TimeIsCorrect(time),
            this.IngredientsIsCorrect(ingredients)
        ]
        for (let i = 0; i < validationMethods.length; i++) {
            if(validationMethods[i].isError)
                return validationMethods[i]
        }
        return {isError: false}
    }
};