import React from "react";
import styled, { keyframes, css } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Btn = styled.button.attrs((props) => ({
  $loading: props.$loading,
}))`
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  color: #fff;
  background: ${({ theme, variant }) => {
    if (variant === "outline") return "transparent";
    if (variant === "success") return "#4caf50";
    if (variant === "danger") return "#d32f2f";
    if (variant === "danger-light") return "#d897adff";
    if (variant === "primary-light") return "#64b5f6";
    return theme.primary;
  }};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.25s, border 0.25s;
  border: ${({ theme, variant }) =>
    variant === "outline" ? `1px solid ${theme.primary}` : "none"};

  &:hover {
    background: ${({ theme, variant, disabled }) => {
      if (disabled) {
        return variant === "outline" ? "transparent" : theme.primary;
      }
      if (variant === "outline") return `${theme.primary}15`;
      if (variant === "success") return "#43a047";
      if (variant === "danger") return "#c62828";
      if (variant === "danger-light") return "#f8bbd0";
      if (variant === "primary-light") return "#42a5f5";
      return theme.primary_dark;
    }};
  }

  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
    `}
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Button = ({ text, isLoading, isDisabled, variant, ...rest }) => (
  <Btn
    {...rest}
    variant={variant}
    disabled={isDisabled || isLoading}
    $loading={isLoading}
  >
    {isLoading && <Spinner />}
    {text}
  </Btn>
);

export default Button;
