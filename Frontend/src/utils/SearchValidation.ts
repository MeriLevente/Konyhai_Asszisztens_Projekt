import type IFormResponse from "@/models/FormResponse"

export default class SearchValidation {
    public static SearchedWordIsValid(sWord: string | undefined) : IFormResponse  {
            if(!sWord)
                return {isError: true, message: "Töltse ki a mezőt!", messageEn: "Fill out the fields!"}
            if(!/^[A-Za-zŽžÀ-ÿ]+$/.test(sWord))
                return {isError: true, message: "A keresett szó csak betűket tartalmazhat!", messageEn: "The searched word can only contain letters!"}
            if(sWord.length < 3)
                return {isError: true, message: "A keresett szó túl rövid!", messageEn: "The searched word is too short!"}
            else
                return {isError: false}
    };
};