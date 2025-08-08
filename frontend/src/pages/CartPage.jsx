import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, updateCart, addToCart } from "../utils/api";
import api from "../utils/api";
import { loadCart } from "../redux/reducers/cartSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import ProductCard from "../components/ProductCard";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 800px) {
    /* NEW – tighter padding on phones */
    padding: 24px 12px;
  }
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const ItemsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummaryColumn = styled.div``;

const Section = styled.section`
  margin-top: 60px;
`;

const SectionHeading = styled.h3`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: ${({ theme }) => theme.primary};
`;

const RecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  @media (max-width: 500px) {
    /* NEW – slimmer cards on very small */
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

export default function CartPage() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.user.token);
  const items = useSelector((s) => s.cart);
  const nav = useNavigate();
  const [recommended, setRecommended] = useState([]);

  /* NEW: defensively drop any cart rows that lack a product */
  const sanitizeCart = (arr) =>
    Array.isArray(arr) ? arr.filter((i) => i && i.product) : [];

  useEffect(() => {
    if (!token) {
      dispatch(openSnackbar({ message: "Please sign in", severity: "info" }));
      nav("/signin");
      return;
    }

    // Load cart and then recommended
    fetchCart(token)
      .then(({ data: cartData }) => {
        const safeCart = sanitizeCart(cartData); // NEW
        dispatch(loadCart(safeCart)); // NEW (uses sanitized list)
        return api.get("/products").then(({ data: all }) => [safeCart, all]); // NEW (pass safe cart forward)
      })
      .then(([cartData, all]) => {
        const inCart = new Set(cartData.map((i) => i.product._id)); // unchanged, cartData is already safe
        const pool = all.filter((p) => !inCart.has(p._id));
        setRecommended(pool.sort(() => 0.5 - Math.random()).slice(0, 4));
      })
      .catch(() => dispatch(openSnackbar({ message: "", severity: "error" })));
  }, [token, dispatch, nav]);

  const changeQty = async (productId, newQty, maxStock) => {
    if (newQty > maxStock) {
      dispatch(
        openSnackbar({
          message: `Sorry, we only have ${maxStock} units in stock`,
          severity: "warning",
        })
      );
      return;
    }
    try {
      await updateCart(token, { productId, qty: newQty });
      const { data } = await fetchCart(token);
      const safe = sanitizeCart(data); // NEW
      dispatch(loadCart(safe)); // NEW
      const oldQty =
        items.find((i) => i.product._id === productId)?.quantity || 0;
      dispatch(
        openSnackbar({
          message:
            newQty > oldQty
              ? "Item quantity increased"
              : "Item quantity reduced",
          severity: "success",
        })
      );
    } catch {
      dispatch(
        openSnackbar({ message: "Failed to update cart", severity: "error" })
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      await updateCart(token, { productId, qty: 0 });
      const { data } = await fetchCart(token);
      const safe = sanitizeCart(data); // NEW
      dispatch(loadCart(safe)); // NEW
      dispatch(
        openSnackbar({ message: "Item removed from cart", severity: "info" })
      );
    } catch {
      dispatch(
        openSnackbar({ message: "Failed to remove item", severity: "error" })
      );
    }
  };

  const handleAddRecommended = async (productId) => {
    if (!token) {
      nav("/signin");
      return;
    }
    try {
      await addToCart(token, { productId, qty: 1 });
      const { data } = await fetchCart(token);
      const safe = sanitizeCart(data); // NEW
      dispatch(loadCart(safe)); // NEW
      dispatch(openSnackbar({ message: "Added to cart", severity: "success" }));
    } catch {
      dispatch(
        openSnackbar({ message: "Failed to add to cart", severity: "error" })
      );
    }
  };

  const subtotal = items.reduce((sum, { product, quantity }) => {
    const price = product.onSale
      ? product.price * (1 - product.salePercent / 100)
      : product.price;
    return sum + price * quantity;
  }, 0);

  return (
    <Container>
      <CartGrid>
        <ItemsColumn>
          {items.length ? (
            items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                onChangeQty={(id, qty) =>
                  changeQty(id, qty, item.product.countInStock)
                }
                onRemove={handleRemove}
              />
            ))
          ) : (
            <p style={{ textAlign: "center", fontSize: 18 }}>
              Your cart is empty
            </p>
          )}
        </ItemsColumn>

        <SummaryColumn>
          <CartSummary subtotal={subtotal} />
        </SummaryColumn>
      </CartGrid>

      {recommended.length > 0 && (
        <Section>
          <SectionHeading>Recommended Products</SectionHeading>
          <RecGrid>
            {recommended.map((p) => (
              <ProductCard key={p._id} p={p} onAdd={handleAddRecommended} />
            ))}
          </RecGrid>
        </Section>
      )}
    </Container>
  );
}
