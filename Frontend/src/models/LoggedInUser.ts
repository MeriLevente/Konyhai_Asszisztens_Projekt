export default interface ILoggedInUser {
    name: string
    token: string
    token_valid_to: Date | null
    id: number | null
    role: string
};