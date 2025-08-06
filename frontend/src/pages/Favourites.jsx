// frontend/src/pages/Favourites.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchFavourites, removeFavourite } from "../utils/api";
import { addToCart } from "../utils/api";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import Button from "../components/Button";

const Page = styled.main`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
`;
const Title = styled.h2`
  font-size: 26px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.primary};
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
`;
const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover img {
    transform: scale(1.02);
  }
`;
const Img = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.2s;
`;
const Info = styled.div`
  padding: 16px;
  flex: 1;
`;
const Name = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;
const Price = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 12px;
`;
const Actions = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
`;

export default function Favourites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.user.token);
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchFavourites(token).then(({ data }) => setFavs(data));
  }, [token, navigate]);

  const handleRemove = async (id) => {
    try {
      await removeFavourite(token, { productId: id });
      setFavs((f) => f.filter((x) => x.productId !== id));
      dispatch(
        openSnackbar({ message: "Removed from favourites", severity: "info" })
      );
    } catch {
      dispatch(
        openSnackbar({ message: "Failed to remove", severity: "error" })
      );
    }
  };

  const handleAddCart = async (id) => {
    try {
      await addToCart(token, { productId: id, qty: 1 });
      dispatch(openSnackbar({ message: "Added to cart", severity: "success" }));
    } catch {
      dispatch(
        openSnackbar({ message: "Add to cart failed", severity: "error" })
      );
    }
  };

  return (
    <Page>
      <Title>Your Favourites</Title>
      {favs.length ? (
        <Grid>
          {favs.map((f) => (
            <Card key={f.productId}>
              <StyledLink to={`/products/${f.productId}`}>
                <Img src={f.image} alt={f.name} />
                <Info>
                  <Name>{f.name}</Name>
                  <Price>${f.price.toFixed(2)}</Price>
                </Info>
              </StyledLink>
              <Actions>
                <Button
                  text="Add to Cart"
                  onClick={() => handleAddCart(f.productId)}
                  variant="primary-light"
                />
                <Button
                  text="Remove"
                  variant="danger"
                  onClick={() => handleRemove(f.productId)}
                />
              </Actions>
            </Card>
          ))}
        </Grid>
      ) : (
        <p>No favourites yet. Browse products and click the ❤ to save them!</p>
      )}
    </Page>
  );
}
