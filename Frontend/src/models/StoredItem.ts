import type Item from "./Item";

export default interface StoredItem {
    userId: number | undefined
    itemId: number | undefined
    storedItem: Item
    quantity: number
}