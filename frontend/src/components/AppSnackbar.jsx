import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { closeSnackbar } from "../redux/reducers/snackbarSlice";

const Bar = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ severity }) =>
    severity === "error"
      ? "#e53935"
      : severity === "warning"
      ? "#fbc02d"
      : severity === "info"
      ? "#2196f3"
      : "#4caf50"};
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 4000;
`;

const AppSnackbar = () => {
  const { open, message, severity } = useSelector((s) => s.snackbar);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => dispatch(closeSnackbar()), 3000);
    return () => clearTimeout(id);
  }, [open, dispatch]);

  if (!open) return null;
  return <Bar severity={severity}>{message}</Bar>;
};

export default AppSnackbar;
