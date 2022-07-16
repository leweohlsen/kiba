import { Purchase, Product } from "./types";

export const calculatePurchaseTotal = (shoppingCart: Record<string, number>, products: Record<string, Product>) => {
    return Object.entries(shoppingCart).reduce((total, [productId, quantity]) => {
        const product = products[productId];
        return total + product.price * quantity;
    }, 0);
};
