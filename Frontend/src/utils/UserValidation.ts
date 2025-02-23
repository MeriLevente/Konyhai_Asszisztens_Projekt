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
    public static PasswordInCorrectForm(pass: string) : IFormResponse {
        const regex: RegExp = /(?=.*[0-9])^(?=.*[A-Z])/gu;
        if (pass.length < 8)
            return {isError: true, message: "A jelszó legyen legalább 8 karakter!", messageEn: "The password must be at least 8 charachters!"}
        if (/\s/g.test(pass))
            return {isError: true, message: "A jelszó érvénytelen karaktert tartalmaz!", messageEn: "The password contains an invalid charachter!"}
        if (!regex.test(pass))
            return {isError: true, message: "A jelszó tartalmazzon legalább 1 nagy betűt és 1 számot!", messageEn: "The password must contain at least one uppercase and one number!"}
        else
            return {isError: false}
    }
     
}