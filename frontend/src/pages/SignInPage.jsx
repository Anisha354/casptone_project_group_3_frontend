import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Authentication from "./Authentication";

const SignInPage = () => {
  const [openAuth, setOpenAuth] = useState(true);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleClose = () => {
    setOpenAuth(false);
    navigate(state?.from || "/", { replace: true });
  };

  return <Authentication openAuth={openAuth} setOpenAuth={handleClose} />;
};

export default SignInPage;
