import type IFormResponse from "@/models/FormResponse"

export default class SearchValidation {
    public static SearchedWordIsValid(sWord: string | undefined) : IFormResponse  {
            if(!sWord)
                return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
            if(!/^[a-zA-Z]+$/.test(sWord))
                return {isError: true, message: "A keresett szó csak betűket tartalmazhat!", messageEn: "The searched word can only contain letters!"}
            else
                return {isError: false}
    };
};