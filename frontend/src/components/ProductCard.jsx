// frontend/src/components/ProductCard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Button from "./Button";
import { useSelector, useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { fetchFavourites, addFavourite, removeFavourite } from "../utils/api";

/* ───────── styled ───────── */
const Card = styled.div`
  width: 260px;
  border: 1px solid ${({ theme }) => theme.text_secondary + "20"};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: box-shadow 0.25s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const FavIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  color: ${({ filled }) => (filled ? "#e53935" : "#ffffffa0")};
  cursor: pointer;
  z-index: 2;
`;

const Img = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Brand = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary + "90"};
  text-transform: uppercase;
`;

const Name = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const DetailsLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Action = styled.div`
  padding: 0 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const Stock = styled.span`
  font-size: 12px;
  color: #4caf50;
`;

const Swatches = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ clr }) => clr};
  border: 1px solid #ddd;
`;

const Sale = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #e53935;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
`;

/* ───────── component ───────── */
const ProductCard = ({ p, onAdd = () => {} }) => {
  const token = useSelector((s) => s.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);

  // Load favourite status once
  useEffect(() => {
    if (!token) return;
    fetchFavourites(token).then(({ data }) => {
      setIsFav(data.some((f) => f.productId === p._id));
    });
  }, [token, p._id]);

  const toggleFav = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      if (isFav) {
        await removeFavourite(token, { productId: p._id });
        dispatch(
          openSnackbar({ message: "Removed from favourites", severity: "info" })
        );
      } else {
        await addFavourite(token, { productId: p._id });
        dispatch(
          openSnackbar({ message: "Added to favourites", severity: "success" })
        );
      }
      setIsFav(!isFav);
    } catch {
      dispatch(openSnackbar({ message: "Action failed", severity: "error" }));
    }
  };

  return (
    <Card>
      {p.onSale && <Sale>-{p.salePercent}%</Sale>}

      <FavIcon filled={isFav} onClick={toggleFav}>
        {isFav ? <FaHeart /> : <FaRegHeart />}
      </FavIcon>

      <DetailsLink to={`/products/${p._id}`}>
        <Img src={p.image} alt={p.name} />
        <Info>
          <Brand>{p.brand}</Brand>
          <Name>{p.name}</Name>
        </Info>
      </DetailsLink>

      <Action>
        <Price>${p.price.toFixed(2)}</Price>
        <Stock>{p.countInStock} left</Stock>
        <Swatches>
          {p.colors.map((c) => (
            <Dot key={c} clr={c} />
          ))}
        </Swatches>
        <Button
          text="Add to Cart"
          variant="primary-light"
          onClick={() => onAdd(p._id, 1)}
        />
      </Action>
    </Card>
  );
};

export default ProductCard;
