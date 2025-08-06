import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { forgotPw } from "../api/api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const Wrapper = styled.div`
  max-width: 420px;
  margin: 80px auto;
  padding: 32px 28px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  border-radius: 10px;
  background: ${({ theme }) => theme.bg_secondary || "#fff"};
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
`;
const Note = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary + 90};
  line-height: 1.45;
`;
const InlineMsg = styled.span`
  font-size: 14px;
  color: ${({ ok }) => (ok ? "#4caf50" : "#e53935")};
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoad] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const dispatch = useDispatch();

  const submit = async () => {
    if (!email.trim()) {
      dispatch(
        openSnackbar({ message: "Enter your e-mail", severity: "error" })
      );
      setMsg("Please enter your e-mail");
      setOk(false);
      return;
    }
    setLoad(true);
    setMsg("");
    try {
      await forgotPw(email.trim().toLowerCase());
      dispatch(
        openSnackbar({
          message: "Password reset e-mail sent",
          severity: "success",
        })
      );
      setMsg("Password reset e-mail sent ✓");
      setOk(true);
      setEmail("");
    } catch {
      dispatch(
        openSnackbar({ message: "Something went wrong", severity: "error" })
      );
      setMsg("Unable to send reset link");
      setOk(false);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Wrapper>
      <h2>Forgot Password</h2>

      <Note>
        Enter the e-mail associated with your account. If we find a match,
        you’ll receive a link to set a new password. You will only receive an
        e-mail if you’re registered.
      </Note>

      <TextInput
        label="Email address"
        value={email}
        placeholder="you@example.com"
        handelChange={(e) => setEmail(e.target.value)}
      />

      {msg && <InlineMsg ok={ok}>{msg}</InlineMsg>}

      <Button text="Send reset link" onClick={submit} isLoading={loading} />
    </Wrapper>
  );
};

export default ForgotPassword;
