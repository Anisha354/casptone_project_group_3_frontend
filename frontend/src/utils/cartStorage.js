// src/utils/cartStorage.js
export const cartKey = (userId) => `cart_${userId}`;

export function loadCartFromStorage(userId) {
  try {
    return JSON.parse(localStorage.getItem(cartKey(userId))) || [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(userId, cart) {
  localStorage.setItem(cartKey(userId), JSON.stringify(cart));
}
