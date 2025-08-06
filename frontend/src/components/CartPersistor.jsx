// src/components/CartPersistor.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCart, clearCart } from "../redux/reducers/cartSlice";
import { loadCartFromStorage, saveCartToStorage } from "../utils/cartStorage";

export default function CartPersistor() {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart);
  const user = useSelector((s) => s.user.user); // adjust if your slice is different

  // 🔄 When user logs in or out, load or clear cart
  useEffect(() => {
    if (user && user._id) {
      const lsCart = loadCartFromStorage(user._id);
      dispatch(loadCart(lsCart));
    } else {
      dispatch(clearCart());
    }
  }, [user, dispatch]);

  // 💾 Whenever cart changes, save for this user
  useEffect(() => {
    if (user && user._id) {
      saveCartToStorage(user._id, cart);
    }
  }, [cart, user]);

  return null;
}
