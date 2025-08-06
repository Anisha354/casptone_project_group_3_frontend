import React, { useState, useEffect } from "react";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button from "./Button";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { fetchFavourites, addFavourite, removeFavourite } from "../utils/api";

const ItemBox = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #eee;
  padding: 24px 0;
  @media (max-width: 600px) {
    /* NEW – stack on very small */
    flex-direction: column;
    align-items: center;
  }
`;

const Image = styled.img`
  width: 160px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  @media (max-width: 600px) {
    /* NEW – full-width pic on phone */
    width: 100%;
    height: auto;
    max-height: 300px;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media (max-width: 600px) {
    /* NEW – full width */
    width: 100%;
  }
`;

const Brand = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Title = styled.h3`
  font-size: 18px;
  margin: 0;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap; /* NEW – prevent overflow */
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const Strike = styled.span`
  font-size: 14px;
  color: #777;
  text-decoration: line-through;
`;

const Badge = styled.span`
  background: #e53935;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
`;

const Desc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap; /* NEW – buttons wrap on phone */
`;

export default function CartItem({ item, onChangeQty, onRemove }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.user.token);
  const { product, quantity } = item;

  const [isFav, setIsFav] = useState(false);

  // load whether this product is already in favourites
  useEffect(() => {
    if (!token) return;
    fetchFavourites(token)
      .then(({ data }) => {
        setIsFav(data.some((f) => f._id === product._id));
      })
      .catch(() => {
        /* ignore */
      });
  }, [token, product._id]);

  const handleFavToggle = async () => {
    if (!token) {
      dispatch(
        openSnackbar({
          message: "Please sign in to manage favourites",
          severity: "info",
        })
      );
      return;
    }
    try {
      if (isFav) {
        await removeFavourite(token, { productId: product._id });
        dispatch(
          openSnackbar({
            message: "Removed from favourites",
            severity: "info",
          })
        );
      } else {
        await addFavourite(token, { productId: product._id });
        dispatch(
          openSnackbar({
            message: "Added to favourites",
            severity: "success",
          })
        );
      }
      setIsFav(!isFav);
    } catch {
      dispatch(
        openSnackbar({
          message: "Could not update favourites",
          severity: "error",
        })
      );
    }
  };

  const unitPrice = product.onSale
    ? product.price * (1 - product.salePercent / 100)
    : product.price;

  return (
    <ItemBox>
      <Image src={product.image} alt={product.name} />

      <Info>
        <Brand>{product.brand}</Brand>
        <Title>{product.name}</Title>

        <PriceRow>
          <Price>${unitPrice.toFixed(2)}</Price>
          {product.onSale && (
            <>
              <Strike>${product.price.toFixed(2)}</Strike>
              <Badge>-{product.salePercent}%</Badge>
            </>
          )}
        </PriceRow>

        <Desc>Sold & shipped by Dress’s Fashion Store</Desc>

        <Controls>
          <Button
            text="−"
            variant="danger-light"
            onClick={() =>
              quantity > 1 && onChangeQty(product._id, quantity - 1)
            }
          />
          <span>{quantity}</span>
          <Button
            text="+"
            variant="success"
            onClick={() => onChangeQty(product._id, quantity + 1)}
          />
          <Button
            text="Remove"
            variant="danger"
            onClick={() => onRemove(product._id)}
          />

          {isFav ? (
            <Favorite
              fontSize="medium"
              style={{ cursor: "pointer", color: "#e53935" }}
              onClick={handleFavToggle}
            />
          ) : (
            <FavoriteBorder
              fontSize="medium"
              style={{ cursor: "pointer" }}
              onClick={handleFavToggle}
            />
          )}
        </Controls>
      </Info>
    </ItemBox>
  );
}
