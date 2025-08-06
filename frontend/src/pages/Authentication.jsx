import React, { useState } from "react";
import { Modal } from "@mui/material";
import styled from "styled-components";
import { Close as CloseIcon } from "@mui/icons-material";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

import MainLogo from "../utils/Images/Logo.png";
import DressLogo from "../utils/Images/DressLogo.png";

const Overlay = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthContainer = styled.div`
  width: 90vw;
  max-width: 900px;
  height: 90vh;
  background: ${({ theme }) => theme.bg};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    overflow-y: auto; /* NEW – allow full-page scroll on mobile */
  }
`;

const Header = styled.div`
  padding: 16px 0;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + "20"};
`;

const MainLogoImg = styled.img`
  height: 40px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.text_secondary};
  &:hover {
    opacity: 0.7;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPane = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.primary + "10"};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const DressLogoImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const RightPane = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    padding: 24px 16px;
    flex: none;
    height: 100%;
  }
`;

const ToggleWrapper = styled.div`
  margin-top: auto;
  text-align: center;
  @media (max-width: 768px) {
    margin-top: 24px;
  }
`;

const ToggleText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ToggleButton = styled.span`
  margin-left: 4px;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Authentication = ({ openAuth, setOpenAuth }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleClose = () => setOpenAuth(false);

  return (
    <Overlay open={openAuth} onClose={handleClose}>
      <AuthContainer>
        <Header>
          <MainLogoImg src={MainLogo} alt="Logo" />
        </Header>

        <CloseButton onClick={handleClose}>
          <CloseIcon />
        </CloseButton>

        <Content>
          <LeftPane>
            <DressLogoImg src={DressLogo} alt="Dress Logo" />
          </LeftPane>

          <RightPane>
            {isLogin ? (
              <SignIn setOpenAuth={setOpenAuth} />
            ) : (
              <SignUp setOpenAuth={setOpenAuth} />
            )}

            <ToggleWrapper>
              <ToggleText>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <ToggleButton onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Sign Up" : "Sign In"}
                </ToggleButton>
              </ToggleText>
            </ToggleWrapper>
          </RightPane>
        </Content>
      </AuthContainer>
    </Overlay>
  );
};

export default Authentication;
