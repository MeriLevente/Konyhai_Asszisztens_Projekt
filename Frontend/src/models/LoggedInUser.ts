export default interface ILoggedInUser {
    id: number | null
    name: string
    token: string
    token_valid_to: Date | null
    role: string
};