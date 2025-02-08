export default interface ILoggedInUser {
    name: string
    token: string
    token_valid_to: Date
    id: number | null
    role: number
};