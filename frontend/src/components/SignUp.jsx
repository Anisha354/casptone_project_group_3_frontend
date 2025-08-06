import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignUp } from "../api/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const Container = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  @media (max-width: 768px) {
    max-width: 100%;
    overflow-y: auto; /* NEW – let the form itself scroll */
    padding-bottom: 32px; /* NEW – tiny space below the button */
  }
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
        `}
`;
const MeterWrap = styled.div`
  height: 6px;
  width: 100%;
  border-radius: 8px;
  background: ${({ theme }) => theme.text_secondary + 20};
  overflow: hidden;
`;
const MeterBar = styled.div`
  height: 100%;
  width: ${({ strength }) => strength}%;
  transition: width 0.3s ease;
  ${({ strength }) => {
    if (strength < 25)
      return css`
        background: #e53935;
      `;
    if (strength < 50)
      return css`
        background: #ff9800;
      `;
    if (strength < 75)
      return css`
        background: #cddc39;
      `;
    return css`
      background: #4caf50;
    `;
  }}
`;

const SignUp = ({ setOpenAuth }) => {
  const dispatch = useDispatch();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [touched, setTouched] = useState({
    first: false,
    email: false,
    password: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);
  const [serverEmailError, setServerEmailError] = useState("");

  useEffect(() => {
    const newErrors = {};
    if (touched.first && !first.trim())
      newErrors.first = "First name is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (touched.email) {
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!emailPattern.test(email))
        newErrors.email = "Please enter a valid email";
    }

    if (touched.password) {
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }

    if (touched.confirm) {
      if (!confirm) newErrors.confirm = "Please confirm your password";
      else if (confirm !== password)
        newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);

    const calc = (pwd) => {
      if (!pwd || pwd.length < 6) return 0;
      const classes =
        (/[a-z]/.test(pwd) ? 1 : 0) +
        (/[A-Z]/.test(pwd) ? 1 : 0) +
        (/\d/.test(pwd) ? 1 : 0) +
        (/[!@#$%^&*(),.?":{}|<>]/.test(pwd) ? 1 : 0);
      return (classes / 4) * 100;
    };
    setStrength(calc(password));
  }, [first, email, password, confirm, touched]);

  const markAllTouched = () =>
    setTouched({
      first: true,
      email: true,
      password: true,
      confirm: true,
    });

  const isFormValid = () => {
    if (
      Object.keys(errors).length ||
      !first ||
      !email ||
      !password ||
      !confirm
    ) {
      dispatch(
        openSnackbar({
          message: "Please correct highlighted fields",
          severity: "error",
        })
      );
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    markAllTouched();
    if (!isFormValid()) return;

    setLoading(true);
    setDisabled(true);
    try {
      const res = await UserSignUp({
        name: `${first.trim()} ${last.trim()}`,
        email: email.trim().toLowerCase(),
        password,
      });
      dispatch(loginSuccess(res.data));
      dispatch(
        openSnackbar({ message: "Sign-up successful!", severity: "success" })
      );
      setOpenAuth(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setServerEmailError(
          err.response.data?.message || "Email already registered"
        );
      } else {
        const msg =
          err.response?.data?.message ||
          (err.message?.includes("Network")
            ? "Network error, please check your connection"
            : "Something went wrong. Try again.");
        dispatch(openSnackbar({ message: msg, severity: "error" }));
      }
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  const onChange = (setter, key) => (e) => {
    setter(e.target.value);
    setServerEmailError("");
    setTouched((t) => ({ ...t, [key]: true }));
  };

  return (
    <Container>
      <Header>
        <Title>Create Account 👗</Title>
        <Sub>Join us for exclusive deals &amp; updates</Sub>
      </Header>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <TextInput
              label="First Name"
              placeholder="Jane"
              value={first}
              handelChange={onChange(setFirst, "first")}
              error={!!errors.first}
            />
            {errors.first && <Helper error>{errors.first}</Helper>}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <TextInput
              label="Last Name"
              placeholder="Doe"
              value={last}
              handelChange={onChange(setLast, "last")}
              error={!!errors.last}
            />
            {errors.last && <Helper error>{errors.last}</Helper>}
          </div>
        </div>

        <div>
          <TextInput
            label="Email Address"
            placeholder="jane.doe@example.com"
            value={email}
            handelChange={onChange(setEmail, "email")}
            error={!!errors.email || !!serverEmailError}
          />
          {(errors.email || serverEmailError) && (
            <Helper error>{errors.email || serverEmailError}</Helper>
          )}
        </div>

        <div>
          <TextInput
            label="Password"
            placeholder="••••••••"
            password
            value={password}
            handelChange={onChange(setPassword, "password")}
            error={!!errors.password}
          />
          <MeterWrap>
            <MeterBar strength={strength} />
          </MeterWrap>
          {errors.password ? (
            <Helper error>{errors.password}</Helper>
          ) : (
            <Helper>
              Strength:&nbsp;
              {strength === 100
                ? "Strongest"
                : strength >= 75
                ? "Strong"
                : strength >= 50
                ? "Fair"
                : strength >= 25
                ? "Weak"
                : "Very weak"}
            </Helper>
          )}
        </div>

        <div>
          <TextInput
            label="Confirm Password"
            placeholder="Repeat your password"
            password
            value={confirm}
            handelChange={onChange(setConfirm, "confirm")}
            error={!!errors.confirm}
          />
          {errors.confirm && <Helper error>{errors.confirm}</Helper>}
        </div>

        <Button
          text="Sign Up"
          onClick={handleSignUp}
          isLoading={loading}
          isDisabled={disabled}
        />
      </div>
    </Container>
  );
};
export default SignUp;
