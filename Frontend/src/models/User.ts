export default interface IUser{
    name?: string | undefined
    email: string
    password: string
    role: string
    token?: string | undefined
};