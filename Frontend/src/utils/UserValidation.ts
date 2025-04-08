import type IFormResponse from "@/models/FormResponse";
import { useUserStore } from "@/stores/userstore";
import CryptoJS from 'crypto-js';

export default class UserValidation {
    private static loginAllFilled(email: string, password: string): IFormResponse  {
        if (!email || !password)
            return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"};
        else
            return {isError: false};
    };

    private static registerAllFilled(name: string, email: string, password: string, confirmPassword: string): IFormResponse  {
        if (!email || !password || !name || !confirmPassword)
            return {isError: true, message: "Töltsön ki minden mezőt!", messageEn: "Fill out all fields!"};
        else
            return {isError: false};
    };

    private static passwordsMatch(pass: string, conf_pass: string): IFormResponse {
        if (pass != conf_pass)
            return {isError: true, message: "A két jelszó nem egyezik!", messageEn: "The passwords doesn't match!"};
        else
            return {isError: false};
    };

    private static passwordInCorrectForm(pass: string): IFormResponse {
        const regex: RegExp = /(?=.*[0-9])^(?=.*[A-Z])/gu;
        if (pass.length < 8)
            return {
                isError: true,
                message: "A jelszó legyen legalább 8 karakter!",
                messageEn: "The password must be at least 8 charachters!"
            };
        if (/\s/g.test(pass))
            return {
                isError: true,
                message: "A jelszó érvénytelen karaktert tartalmaz!",
                messageEn: "The password contains an invalid charachter!"
            };
        if (!regex.test(pass))
            return {
                isError: true,
                message: "A jelszó tartalmazzon legalább 1 nagy betűt és 1 számot!",
                messageEn: "The password must contain at least one uppercase and one number!"
            };
        else
            return {isError: false};
    };

    private static emailIsValid(email: string): IFormResponse {
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return {isError: true, message: "Az email cím érvénytelen!", messageEn: "The email address is invalid!"};
        }
        else
            return {isError: false};
    };

    public static loginIsValid(email: string, password: string): IFormResponse{
        const validationMethods: IFormResponse[] = [
            this.loginAllFilled(email, password), 
            this.emailIsValid(email), 
            this.passwordInCorrectForm(password)
        ];
        for (let i = 0; i < validationMethods.length; i++) {
            if (validationMethods[i].isError)
                return validationMethods[i];
        };
        return {isError: false};
    };
     
    public static registerIsValid(name: string, email: string, password: string, confirmPassword: string): IFormResponse {
        const validationMethods: IFormResponse[] = [
            this.registerAllFilled(name, email, password, confirmPassword), 
            this.emailIsValid(email), 
            this.passwordInCorrectForm(password),
            this.passwordsMatch(password, confirmPassword)
        ];
        for (let i = 0; i < validationMethods.length; i++) {
            if (validationMethods[i].isError)
                return validationMethods[i];
        };
        return {isError: false};
    };

    public static isAutherizedRole(rightRole: string): boolean {
        return CryptoJS.AES.decrypt(useUserStore().user?.role!, import.meta.env.VITE_SECRET_WORD).toString(CryptoJS.enc.Utf8) == rightRole;
    };
};