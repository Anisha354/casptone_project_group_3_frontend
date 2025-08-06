import React from "react";
import styled from "styled-components";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const SummaryBox = styled.div`
  border: 1px solid #eee;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 800px) {
    /* NEW – fix mobile overflow */
    width: 100%;
    box-sizing: border-box;
    padding: 24px 16px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const Total = styled(Row)`
  font-weight: bold;
  font-size: 16px;
`;

export default function CartSummary({ subtotal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartLen = useSelector((s) => s.cart.length);

  // Ontario: GST 5%, PST 8%
  const gst = subtotal * 0.05;
  const pst = subtotal * 0.08;
  const total = subtotal + gst + pst;

  const handleCheckout = () => {
    if (cartLen === 0) {
      dispatch(
        openSnackbar({
          message: "Your cart is empty",
          severity: "info",
        })
      );
    } else {
      navigate("/checkout");
    }
  };

  return (
    <SummaryBox>
      <Row>
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </Row>
      <Row>
        <span>GST (5%)</span>
        <span>${gst.toFixed(2)}</span>
      </Row>
      <Row>
        <span>PST (8%)</span>
        <span>${pst.toFixed(2)}</span>
      </Row>
      <Total>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </Total>
      <Button
        text="Proceed to Checkout"
        variant="primary-light"
        isDisabled={cartLen === 0}
        onClick={handleCheckout}
      />
    </SummaryBox>
  );
}
