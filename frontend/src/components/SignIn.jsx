import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";

import { UserSignIn } from "../api/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { useNavigate, Link } from "react-router-dom";

/* ─── styled (unchanged basics) ─── */
const Container = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;
const Sub = styled.span`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary + 90};
`;
const Helper = styled.span`
  font-size: 13px;
  margin-top: 4px;
  ${({ error, theme }) =>
    error
      ? css`
          color: #e53935;
        `
      : css`
          color: ${theme.text_secondary + 90};
        `};
`;
const ForgotLink = styled(Link)`
  align-self: flex-end;
  margin-top: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: opacity 0.25s;
  &:hover {
    opacity: 0.75;
  }
`;

/* ─── component ─── */
const SignIn = ({ setOpenAuth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  /* validation & helpers (unchanged) */
  useEffect(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (touched.email) {
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!emailPattern.test(email))
        newErrors.email = "Please enter a valid email";
    }
    if (touched.password && !password)
      newErrors.password = "Password is required";
    setErrors(newErrors);
  }, [email, password, touched]);

  const markAllTouched = () => setTouched({ email: true, password: true });

  const isFormValid = () =>
    !(Object.keys(errors).length || !email || !password);

  const handleSignIn = async () => {
    markAllTouched();
    if (!isFormValid()) {
      dispatch(
        openSnackbar({
          message: "Please correct highlighted fields",
          severity: "error",
        })
      );
      return;
    }

    setLoading(true);
    setDisabled(true);
    setServerError("");

    try {
      const res = await UserSignIn({
        email: email.trim().toLowerCase(),
        password,
      });
      dispatch(loginSuccess(res.data));

      dispatch(
        openSnackbar({ message: "Login successful", severity: "success" })
      );
      if (setOpenAuth) setOpenAuth(false);
      else navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.message?.includes("Network")
          ? "Network error, please check your connection"
          : "Invalid email or password");
      setServerError(msg);
      dispatch(openSnackbar({ message: msg, severity: "error" }));
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  const onChange = (setter, key) => (e) => {
    setter(e.target.value);
    setServerError("");
    setTouched((t) => ({ ...t, [key]: true }));
  };

  /* ─── UI ─── */
  return (
    <Container>
      <Header>
        <Title>Welcome Back 👋</Title>
        <Sub>Please sign in using your account details</Sub>
      </Header>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* e-mail field */}
        <div>
          <TextInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            handelChange={onChange(setEmail, "email")}
            error={!!errors.email}
          />
          {errors.email && <Helper error>{errors.email}</Helper>}
        </div>

        {/* password field */}
        <div>
          <TextInput
            label="Password"
            placeholder="••••••••"
            password
            value={password}
            handelChange={onChange(setPassword, "password")}
            error={!!errors.password || !!serverError}
          />
          {(errors.password || serverError) && (
            <Helper error>{errors.password || serverError}</Helper>
          )}
        </div>

        {/* link that closes modal + navigates */}
        <ForgotLink
          to="/forgot-password"
          onClick={() => setOpenAuth && setOpenAuth(false)}
        >
          Forgot Password?
        </ForgotLink>

        <Button
          text="Sign In"
          onClick={handleSignIn}
          isLoading={loading}
          isDisabled={disabled}
        />
      </div>
    </Container>
  );
};

export default SignIn;
