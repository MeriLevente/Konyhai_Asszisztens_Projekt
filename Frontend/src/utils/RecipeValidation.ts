import type IFormResponse from "@/models/FormResponse"

export default class RecipeValidation {
    public static RecipeAllFilled(name: string, nameEn: string, difficulty: number, time: number, image: string, type: string, steps: string, stepsEn: string) : IFormResponse  {
            if(!name || !nameEn || !image || !difficulty || !time || !type || !steps || !stepsEn)
                return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
            else
                return {isError: false}
    };
};