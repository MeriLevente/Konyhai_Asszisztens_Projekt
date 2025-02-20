import type IFormResponse from "@/models/FormResponse";

export default class UserValidation {
    public static LoginAllFilled(email: string, password: string) : IFormResponse  {
        if(!email || !password)
            return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
        else
            return {isError: false}
    };
    public static RegisterAllFilled(name: string, email: string, password: string, confirm_password: string) : IFormResponse  {
        if(!email || !password || !name || !confirm_password)
            return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"}
        else
            return {isError: false}
    };
    public static PasswordsMatch(pass: string, conf_pass: string) : IFormResponse {
        if(pass != conf_pass)
            return {isError: true, message: "A két jelszó nem egyezik!", messageEn: "The passwords doesn't match!"}
        else
            return {isError: false}
    }
}