import type IFormResponse from "@/models/FormResponse"

export default class TypeValidation {
    public static TypeAllFilled(name: string, nameEn: string, image: string) : IFormResponse  {
            if(!name || !nameEn || !image)
                return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
            else
                return {isError: false}
    };
};