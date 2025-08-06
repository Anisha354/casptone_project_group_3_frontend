// frontend/src/pages/OrderSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineCheckCircle } from "react-icons/ai";

const Container = styled.div`
  max-width: 600px;
  margin: 80px auto;
  text-align: center;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
`;

const Icon = styled(AiOutlineCheckCircle)`
  color: #4caf50;
  font-size: 64px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  font-size: 18px;
  margin-bottom: 24px;
`;

const Section = styled.div`
  text-align: left;
  margin: 20px 0;
`;

const SectionTitle = styled.h3`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.primary};
`;

const Item = styled.div`
  margin: 8px 0;
`;

const Button = styled.button`
  margin-top: 24px;
  background: #ffa733;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
`;

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <Container>
      <Icon />
      <Title>Thank you! Your order is confirmed.</Title>
      <SubTitle>
        Order ID: <strong>{order._id}</strong>
      </SubTitle>
      <SubTitle>
        Total paid: <strong>${order.total.toFixed(2)}</strong>
      </SubTitle>

      <Section>
        <SectionTitle>Shipping Address</SectionTitle>
        <p>{order.address.street}</p>
        <p>
          {order.address.city}, {order.address.province}{" "}
          {order.address.postalCode}, {order.address.country}
        </p>
        <p>Contact: {order.phone}</p>
      </Section>

      <Section>
        <SectionTitle>Payment Method</SectionTitle>
        <p>Card ending **** {order.payment.cardLast4}</p>
        <p>Expiry: {order.payment.expiry}</p>
      </Section>

      <Section>
        <SectionTitle>Items Ordered</SectionTitle>
        {order.items.map((it) => (
          <Item key={it.id}>
            <strong>{it.name}</strong> ×{it.quantity} @ ${it.price.toFixed(2)}
          </Item>
        ))}
      </Section>

      <Button onClick={() => navigate("/")}>Continue Shopping</Button>
    </Container>
  );
}
