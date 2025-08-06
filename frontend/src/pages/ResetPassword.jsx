import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { resetPw } from "../api/api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const Box = styled.div`
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
const Helper = styled.span`
  font-size: 13px;
  ${({ error, ok }) =>
    error
      ? css`
          color: #e53935;
        `
      : ok
      ? css`
          color: #4caf50;
        `
      : css`
          color: #666;
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pwd, setPwd] = useState("");
  const [confirm, setConf] = useState("");
  const [strength, setStr] = useState(0);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoad] = useState(false);

  useEffect(() => {
    const calc = (v) => {
      if (!v || v.length < 6) return 0;
      const classes =
        (/[a-z]/.test(v) ? 1 : 0) +
        (/[A-Z]/.test(v) ? 1 : 0) +
        (/\d/.test(v) ? 1 : 0) +
        (/[!@#$%^&*(),.?":{}|<>]/.test(v) ? 1 : 0);
      return (classes / 4) * 100;
    };
    setStr(calc(pwd));
  }, [pwd]);

  const submit = async () => {
    if (pwd.length < 6) {
      setErr("Min 6-character password");
      setOk(false);
      return;
    }
    if (pwd !== confirm) {
      setErr("Passwords do not match");
      setOk(false);
      return;
    }

    setErr("");
    setLoad(true);
    setOk(false);
    try {
      await resetPw(token, pwd);
      dispatch(
        openSnackbar({
          message: "Password changed successfully",
          severity: "success",
        })
      );
      setOk(true);
      setPwd("");
      setConf("");
      setTimeout(() => navigate("/", { replace: true }), 5200);
    } catch {
      dispatch(
        openSnackbar({ message: "Link invalid or expired", severity: "error" })
      );
      setErr("Reset link invalid or expired");
      setOk(false);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Box>
      <h2>Set New Password</h2>

      <TextInput
        label="New Password"
        password
        value={pwd}
        handelChange={(e) => setPwd(e.target.value)}
      />

      {/* strength meter */}
      <MeterWrap>
        <MeterBar strength={strength} />
      </MeterWrap>
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

      <TextInput
        label="Confirm Password"
        password
        value={confirm}
        handelChange={(e) => setConf(e.target.value)}
      />

      {err && <Helper error>{err}</Helper>}
      {ok && !err && <Helper ok>Password changed successfully ✓</Helper>}

      <Button text="Save password" onClick={submit} isLoading={loading} />
    </Box>
  );
};

export default ResetPassword;
