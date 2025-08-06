/*  src/pages/ProductDetail.jsx  */
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { loadCart } from "../redux/reducers/cartSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import {
  fetchCart,
  addToCart,
  fetchFavourites,
  addFavourite,
} from "../utils/api";
import ProductCard from "../components/ProductCard";
import { Stars } from "../components/Rating";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

/* 🗂── layout grid ─────────────────────────────── */
const Page = styled.main`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1.1fr 300px;
  gap: 36px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    justify-items: center;

    /* make BuyBox full width on mobile */
    & > aside {
      width: 100%;
      max-width: none;
      min-width: auto;
    }
  }
`;
const colourNames = {
  "#000000": "Black",
  "#ffffff": "White",
  "#c7e1e6": "Powder Blue",
  "#f5c6ce": "Blush Pink",
  "#f8e1e7": "Soft Pink",
  "#bae1ff": "Pastel Blue",
  "#8b0000": "Dark Red",
  "#f3f3f3": "Light Grey",
  "#ffdee3": "Peach",
  "#dbe7a3": "Sage",
  "#f5deb3": "Wheat",
  "#e4c1f9": "Lavender",
  "#ffb6c1": "Light Pink",
  "#000080": "Navy",
  "#f8f8ff": "Ghost White",
  "#c2b280": "Khaki",
  "#f5f5f5": "Smoke",
  "#9c7b4b": "Cocoa",
  "#ffefd5": "Papaya",
  "#ff69b4": "Hot Pink",
};
/* ── Gallery ──────────────────────────────────── */
const LargeImg = styled.img`
  width: 100%;
  height: 500px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fff;
`;
const Thumbs = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  overflow-x: auto;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;
const Thumb = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border: 2px solid ${({ active }) => (active ? "#000" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
`;

/* ── Info column ──────────────────────────────── */
const Title = styled.h1`
  font-size: 22px;
  margin: 0 0 6px;
`;
const Brand = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
`;
const Price = styled.div`
  margin: 18px 0 10px;
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;
const Strike = styled.span`
  font-size: 18px;
  color: #777;
  text-decoration: line-through;
  margin-left: 8px;
`;
const Badge = styled.span`
  margin-left: 10px;
  font-size: 13px;
  padding: 2px 6px;
  background: #e53935;
  color: #fff;
  border-radius: 4px;
`;
const ColourRow = styled.div`
  margin: 20px 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Dot = styled.span`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid ${({ active }) => (active ? "#000" : "#ddd")};
  background: ${({ clr }) => clr};
`;
const SizeRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;
const SizeBtn = styled.button`
  padding: 6px 16px;
  border: 1px solid ${({ active }) => (active ? "#000" : "#ccc")};
  background: ${({ active }) => (active ? "#000" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
`;
const Stock = styled.span`
  font-weight: 600;
  display: inline-block;
  margin-bottom: 22px;
  color: ${({ inStock }) => (inStock ? "#4caf50" : "#e53935")};
`;
const SectionTitle = styled.h3`
  margin: 24px 0 10px;
`;

/* size-chart */
const Chart = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 14px;
  & td,
  & th {
    padding: 6px 10px;
    border: 1px solid #eee;
  }
  & th {
    background: #fafafa;
  }
`;

/* ===== Purchase column (replace the old PurchaseCard & children) ===== */
const BuyBox = styled.aside`
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 260px;

  @media (max-width: 960px) {
    align-items: center;
    padding: 16px;
  }
`;

const PriceTag = styled.h2`
  font-size: 34px;
  font-weight: 800;
  margin: 0;
`;
const Note = styled.p`
  font-size: 14px;
  margin: 0;
  color: ${({ theme }) => theme.text_secondary + 90};
  line-height: 1.4;
`;
const SelectQty = styled.select`
  width: 100%;
  font-size: 15px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  background: ${({ theme }) => theme.bg};
`;
const CTA = styled.button`
  width: 100%;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  ${({ variant }) =>
    variant === "buy"
      ? css`
          background: #ffa733;
          &:hover {
            background: #ff9621;
          }
        `
      : variant === "fav"
      ? css`
          background: #fff;
          border: 1px solid ${({ theme }) => theme.primary};
          color: ${({ theme }) => theme.primary};
          &:hover {
            background: ${({ theme }) => theme.primary + 15};
          }
        `
      : css`
          background: #ffd814;
          &:hover {
            background: #f7ca00;
          }
        `}
`;

/* ── Reviews section ─────────────────────────── */
const ReviewGrid = styled.div`
  margin: 60px auto;
  max-width: 960px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const SimilarWrap = styled.section`
  margin: 80px auto 40px;
  max-width: 1200px;
`;
const SimilarHeading = styled.h3`
  text-align: center;
  margin-bottom: 24px;
`;
const SimilarRow = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;

  @media (max-width: 760px) {
    flex-direction: column;
    overflow-x: visible;
    align-items: center;
  }
`;
const Bar = styled.div`
  height: 10px;
  background: #ffd814;
  width: ${({ pct }) => pct}%;
`;

const ProductDetail = () => {
  const token = useSelector((s) => s.user.token);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [img, setImg] = useState("");
  const [clr, setClr] = useState("");
  const [size, setSz] = useState("");
  const [qty, setQty] = useState(1);
  const [similar, setSimilar] = useState([]);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    (async () => {
      const prod = (await api.get(`/api/products/${id}`)).data;
      setP(prod);
      setImg(prod.image);
      setClr(prod.colors[0]);
      setSz(prod.sizes?.[0] || "M");
      const { data: all } = await api.get("/api/products");
      const pool = all.filter(
        (it) => it._id !== id && it.category === prod.category
      );
      setSimilar(pool.sort(() => 0.5 - Math.random()).slice(0, 4));
    })();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (!token) return;
    fetchFavourites(token).then(({ data }) => {
      setIsFav(data.some((f) => f.productId === id));
    });
  }, [token, id]);

  if (!p) return null;
  const requireLogin = () => {
    if (!token) {
      nav("/signin", { state: { msg: "You must log in first to add items" } });
      return false;
    }
    return true;
  };
  const final = p.onSale
    ? (p.price * (1 - p.salePercent / 100)).toFixed(2)
    : p.price.toFixed(2);

  const sizeOptions = p.sizes?.length
    ? p.sizes
    : p.category === "Accessory"
    ? p.name.toLowerCase().includes("hat")
      ? ["54 cm", "56 cm", "58 cm"]
      : p.name.toLowerCase().includes("bag")
      ? ["Mini", "Small", "Medium", "Large"]
      : ["One Size"]
    : ["XS", "S", "M", "L", "XL"];
  const avgRating = p.reviews.length
    ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
    : 0;

  const counts = [0, 0, 0, 0, 0];
  p.reviews.forEach((r) => counts[r.rating - 1]++);
  const totalRev = p.reviews.length || 1;

  const handleAdd = async () => {
    if (!requireLogin()) return;
    try {
      await addToCart(token, { productId: id, qty });
      const { data } = await fetchCart(token);
      dispatch(loadCart(data));
      dispatch(
        openSnackbar({
          message: `Added ${qty}× to cart`,
          severity: "success",
        })
      );
    } catch {
      dispatch(openSnackbar({ message: "Failed to add", severity: "error" }));
    }
  };

  const handleBuy = async () => {
    if (!requireLogin()) return;
    await handleAdd();
    nav("/cart");
  };

  const handleFav = async () => {
    console.log("💖 handleFav clicked");
    if (!requireLogin()) return;
    if (isFav) {
      dispatch(
        openSnackbar({ message: "Already in favourites", severity: "info" })
      );
      return;
    }
    try {
      await addFavourite(token, { productId: id });
      setIsFav(true);
      dispatch(
        openSnackbar({ message: "Added to favourites", severity: "success" })
      );
    } catch {
      dispatch(
        openSnackbar({
          message: "Failed to add to favourites",
          severity: "error",
        })
      );
    }
  };

  return (
    <>
      <Page>
        {/* Gallery */}
        <div>
          <LargeImg src={img} alt={p.name} />
          <Thumbs>
            <Thumb
              src={p.image}
              active={img === p.image}
              onClick={() => setImg(p.image)}
            />
          </Thumbs>
        </div>

        {/* Info */}
        <div>
          <Title>{p.name}</Title>
          <Brand>{p.brand}</Brand>
          <div style={{ margin: "6px 0" }}>
            <Stars value={avgRating} size={22} />
          </div>
          <Price>
            ${final}
            {p.onSale && (
              <>
                <Strike>${p.price.toFixed(2)}</Strike>
                <Badge>-{p.salePercent}%</Badge>
              </>
            )}
          </Price>
          <ColourRow>
            <span style={{ fontSize: 14 }}>Colour:</span>
            {p.colors.map((c) => (
              <Dot
                key={c}
                clr={c}
                active={c === clr}
                title={colourNames[c] || "Selected colour"}
                onClick={() => setClr(c)}
              />
            ))}
          </ColourRow>
          <SectionTitle>Size:</SectionTitle>
          <SizeRow>
            {sizeOptions.map((s) => (
              <SizeBtn key={s} active={s === size} onClick={() => setSz(s)}>
                {s}
              </SizeBtn>
            ))}
            <details>
              <summary style={{ cursor: "pointer", fontSize: 14 }}>
                View size chart
              </summary>
              <Chart>{/* unchanged size chart markup */}</Chart>
            </details>
          </SizeRow>
          <Stock inStock={p.countInStock > 0}>
            {p.countInStock > 0
              ? `${p.countInStock} in stock`
              : "Currently unavailable"}
          </Stock>
          <SectionTitle>About this item</SectionTitle>
          <p style={{ lineHeight: 1.6, fontSize: 15 }}>{p.description}</p>
        </div>

        {/* Purchase card */}
        <BuyBox>
          <div>
            <PriceTag>${p.price.toFixed(2)}</PriceTag>
            <Note>FREE delivery in 3-7 business days</Note>
          </div>

          <SelectQty value={qty} onChange={(e) => setQty(+e.target.value)}>
            {[...Array(Math.min(10, p.countInStock)).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>
                Quantity: {n + 1}
              </option>
            ))}
          </SelectQty>
          <CTA onClick={handleAdd} variant="cart">
            Add to Cart
          </CTA>
          <CTA onClick={handleBuy} variant="buy">
            Buy Now
          </CTA>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            <strong>Ships from&nbsp;</strong>Dress’s Fashion Store
            <br />
            <strong>Sold by&nbsp;</strong>Dress’s Fashion Store
            <br />
            <strong>Returns&nbsp;</strong>Eligible for replacement only (size
            mismatch)
          </div>
          <CTA variant="fav" onClick={handleFav}>
            {isFav ? "In Favourites" : "Add to Favourites"}
          </CTA>
        </BuyBox>
      </Page>

      {/* Reviews */}
      <ReviewGrid>
        {/* star summary */}
        <div>
          <SectionTitle>Customer reviews</SectionTitle>
          <div style={{ fontSize: 26, fontWeight: 700, marginLeft: 100 }}>
            {(
              p.reviews.reduce((a, b) => a + b.rating, 0) / totalRev || 0
            ).toFixed(1)}{" "}
            out of 5
          </div>
          {[...counts].reverse().map((ct, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                margin: "4px 0",
              }}
            >
              <span style={{ width: 40, fontSize: 14 }}>{5 - i} star</span>
              <div style={{ flex: 1, background: "#eee" }}>
                <Bar pct={(ct / totalRev) * 100} />
              </div>
              <span style={{ fontSize: 13, width: 28, textAlign: "right" }}>
                {Math.round((ct / totalRev) * 100)}%
              </span>
            </div>
          ))}
        </div>

        {/* top reviews */}
        <div>
          <SectionTitle>Top reviews</SectionTitle>
          {p.reviews.map((r, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 600 }}>{r.user}</div>
              <Stars value={r.rating} size={18} />
              <p style={{ fontSize: 15, lineHeight: 1.5 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      </ReviewGrid>

      {/* Similar products  ─ centred heading then cards */}
      {similar.length > 0 && (
        <SimilarWrap>
          <SimilarHeading>Similar products</SimilarHeading>
          <SimilarRow>
            {similar.map((it) => (
              <Link
                key={it._id}
                to={`/products/${it._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ProductCard p={it} />
              </Link>
            ))}
          </SimilarRow>
        </SimilarWrap>
      )}
    </>
  );
};

export default ProductDetail;
