import React from "react";
import styled from "styled-components";

/* ---------- styled ---------- */
const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin: 20px 0 10px;
`;
const Search = styled.input`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 6px;
  min-width: 220px;
  font-size: 15px;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary + 50};
  }
`;
const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 6px;
  font-size: 15px;
`;

/* ---------- component ---------- */
const SearchSortBar = ({ value, onSearch, sort, onSort }) => (
  <Bar>
    <Search
      placeholder="Search products…"
      value={value}
      onChange={(e) => onSearch(e.target.value)}
    />
    <Select value={sort} onChange={(e) => onSort(e.target.value)}>
      <option value="">Sort By…</option>
      <option value="price-asc">Price • Low → High</option>
      <option value="price-desc">Price • High → Low</option>
      <option value="name-asc">Name • A → Z</option>
      <option value="name-desc">Name • Z → A</option>
      <option value="brand-asc">Brand • A → Z</option>
      <option value="brand-desc">Brand • Z → A</option>
      <option value="stock-desc">Stock • High → Low</option>
      <option value="discount-desc">Biggest Discount</option>
    </Select>
  </Bar>
);

export default SearchSortBar;
