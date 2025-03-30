import type IFormResponse from "@/models/FormResponse"

export default class ItemValidation {
    public static ItemAllFilled(name: string, nameEn: string, type: number, unit: string, image: string) : IFormResponse  {
            if(!name || !nameEn || !unit || !type)
                return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
            else
                return {isError: false}
    };
};