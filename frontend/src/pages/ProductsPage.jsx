// src/pages/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProducts, addToCart, fetchCart } from "../utils/api";
import { loadCart } from "../redux/reducers/cartSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const Controls = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 4px;
  font-size: 16px;
  width: 240px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 4px;
  font-size: 16px;
`;

const Wrap = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
`;

export default function ProductsPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState([]);

  const token = useSelector((s) => s.user.token);
  const dispatch = useDispatch();
  const nav = useNavigate();

  // load products + derive categories
  useEffect(() => {
    getAllProducts()
      .then(({ data }) => {
        setList(data);
        const cats = Array.from(new Set(data.map((p) => p.category)));
        setCategories(cats);
      })
      .catch((err) => {
        console.error("Load products failed", err);
        dispatch(
          openSnackbar({
            message: "Failed to load products",
            severity: "error",
          })
        );
      });
  }, [dispatch]);

  // add-to-cart handler
  const handleAdd = async (id, qty = 1) => {
    if (!token) {
      nav("/signin");
      return;
    }
    try {
      await addToCart(token, { productId: id, qty });
      const { data } = await fetchCart(token);
      dispatch(loadCart(data));
      dispatch(openSnackbar({ message: "Added to cart", severity: "success" }));
    } catch {
      dispatch(openSnackbar({ message: "Add failed", severity: "error" }));
    }
  };

  // apply search, category filter, and sort
  let filtered = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  if (category !== "All") {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (sort === "priceAsc") {
    filtered = filtered.sort(
      (a, b) =>
        a.price * (1 - (a.salePercent || 0) / 100) -
        b.price * (1 - (b.salePercent || 0) / 100)
    );
  } else if (sort === "priceDesc") {
    filtered = filtered.sort(
      (a, b) =>
        b.price * (1 - (b.salePercent || 0) / 100) -
        a.price * (1 - (a.salePercent || 0) / 100)
    );
  } else if (sort === "nameAsc") {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "nameDesc") {
    filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <>
      <Controls>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Name: A → Z</option>
          <option value="nameDesc">Name: Z → A</option>
        </Select>
      </Controls>

      <Wrap>
        {filtered.map((p) => (
          <ProductCard key={p._id} p={p} onAdd={handleAdd} />
        ))}
      </Wrap>
    </>
  );
}
