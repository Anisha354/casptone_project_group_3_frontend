// src/components/Navbar.jsx
import React, { useState } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import {
  FavoriteBorder,
  ShoppingCartOutlined,
  MenuRounded,
  CloseRounded,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { logout } from "../redux/reducers/userSlice";
import { useDispatch } from "react-redux";

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 34px;
`;

const NavItems = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0 auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLink = styled(NavLink)`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 0.3s, border-bottom 0.3s;

  &.active,
  &:hover {
    color: ${({ theme }) => theme.primary};
    border-bottom: 2px solid ${({ theme }) => theme.primary};
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileToggle = styled.div`
  display: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text_primary};

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;

const OverlayContent = styled.div`
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CloseButton = styled.div`
  align-self: flex-end;
  cursor: pointer;
  color: ${({ theme }) => theme.text_primary};
`;

const OverlayNav = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
`;

const OverlayIcons = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Navbar = ({ openAuth, setOpenAuth, currentUser }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Nav>
      <Container>
        <LogoWrapper>
          <Logo src={LogoImg} alt="Logo" />
        </LogoWrapper>

        <NavItems>
          <li>
            <StyledLink to="/">Home</StyledLink>
          </li>
          <li>
            <StyledLink to="/products">Shop</StyledLink>
          </li>
          <li>
            <StyledLink to="/Contact">Contact</StyledLink>
          </li>
        </NavItems>

        <IconGroup>
          {currentUser ? (
            <>
              <StyledLink to="/favourites">
                <FavoriteBorder fontSize="large" />
              </StyledLink>
              <StyledLink to="/cart">
                <ShoppingCartOutlined fontSize="large" />
              </StyledLink>
              <Avatar src={currentUser.img}>{currentUser.name[0]}</Avatar>
              <Button text="Logout" small onClick={handleLogout} />
            </>
          ) : (
            <Button text="Sign In" small onClick={() => setOpenAuth(true)} />
          )}
        </IconGroup>

        <MobileToggle onClick={() => setOpen(true)}>
          <MenuRounded fontSize="large" />
        </MobileToggle>
      </Container>

      <Overlay open={open}>
        <OverlayContent>
          <CloseButton onClick={() => setOpen(false)}>
            <CloseRounded fontSize="large" />
          </CloseButton>

          <OverlayNav>
            <li>
              <StyledLink to="/" onClick={() => setOpen(false)}>
                Home
              </StyledLink>
            </li>
            <li>
              <StyledLink to="/products" onClick={() => setOpen(false)}>
                Shop
              </StyledLink>
            </li>
            <li>
              <StyledLink to="/Contact" onClick={() => setOpen(false)}>
                Contact
              </StyledLink>
            </li>
          </OverlayNav>

          <OverlayIcons>
            {currentUser ? (
              <>
                <StyledLink to="/favourites" onClick={() => setOpen(false)}>
                  <FavoriteBorder fontSize="medium" />
                </StyledLink>
                <StyledLink to="/cart" onClick={() => setOpen(false)}>
                  <ShoppingCartOutlined fontSize="medium" />
                </StyledLink>
                <Avatar src={currentUser.img}>{currentUser.name[0]}</Avatar>
                <Button text="Logout" small onClick={handleLogout} />
              </>
            ) : (
              <Button
                text="Sign In"
                small
                onClick={() => {
                  setOpenAuth(true);
                  setOpen(false);
                }}
              />
            )}
          </OverlayIcons>
        </OverlayContent>
      </Overlay>
    </Nav>
  );
};

export default Navbar;
