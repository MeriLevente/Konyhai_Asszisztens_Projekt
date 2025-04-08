import type Item from "./Item";

export default interface IStoredItem {
    userId?: number | undefined
    itemId?: number | undefined
    storedItem?: Item | undefined
    quantity: number
}