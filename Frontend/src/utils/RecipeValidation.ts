import type IFormResponse from "@/models/FormResponse"
import type Ingredient from "@/models/Ingredient"
import type Item from "@/models/Item"

export default class RecipeValidation {
    private static RecipeAllFilled
        (name: string, nameEn: string, type: string, steps: string, stepsEn: string) : IFormResponse {
            if(!name || !nameEn || !type || !steps || !stepsEn)
                return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
            return {isError: false}
    };

    private static DifficultyIsCorrect(difficulty: number) : IFormResponse {
        if(Number(difficulty) <= 0 || Number(difficulty) > 10)
            return {isError: true, message: "A nehézség 1 és 10 között legyen!", messageEn: "Difficulty must be between 1 and 10!"}
        return {isError: false}
    };

    private static TimeIsCorrect(time: number) : IFormResponse {
        if(Number(time) <= 0 || Number(time) > 10080)
            return {isError: true, message: "Az elkészítési idő túl hosszú vagy helytelen!", messageEn: "The prep time is too long or incorrect!"}
        return {isError: false}
    };

    public static RecipeIsCorrect
    (name: string, nameEn: string, difficulty: number, time: number,
     image: string, type: string, steps: string, stepsEn: string, ingredients: Ingredient[]
    ) : IFormResponse 
    {
        const validationMethods: IFormResponse[] = [
            this.RecipeAllFilled(name, nameEn, type, steps, stepsEn),
            this.DifficultyIsCorrect(difficulty),
            this.TimeIsCorrect(time)
        ]
        for (let i = 0; i < validationMethods.length; i++) {
            if(validationMethods[i].isError)
                return validationMethods[i]
        }
        return {isError: false}
    };

    public static RecipeStepIsCorrect(step: string) : IFormResponse {
        if (step == "")
            return {isError: true, message: "Töltse ki a lépés mezőt!", messageEn: "Fill out the step field!"};
        if (step.includes("#"))
            return {isError: true, message: "Kérem ne használja a '#' karaktert!", messageEn: "Do not use the '#' charachter!"};
        return {isError: false};
    };

    public static IngredientInputCorrect(type: number, ingr: Item, quantity: number) : IFormResponse {
        if (!type || !ingr || !quantity)
            return {isError: true, message: "Töltsön ki a minden mezőt!", messageEn: "Fill out all fields!"};
        if(Number(quantity) <= 0 || Number(quantity) > 10000)
            return {isError: true, message: "Helytelen mennyiséget adott meg!", messageEn: "Invalid quantity!"};
        return {isError: false};
    }
};