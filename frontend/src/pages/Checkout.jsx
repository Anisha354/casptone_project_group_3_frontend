// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  placeOrder,
  fetchCart,
  fetchAddresses,
  addAddress,
  fetchPayments,
  addPayment,
} from "../utils/api";
import { loadCart, clearCart } from "../redux/reducers/cartSlice";
import { openSnackbar } from "../redux/reducers/snackbarSlice";
import { useNavigate } from "react-router-dom";

// ── Tax rates & provinces ───────────────────────────────
const HST_RATES = { ON: 0.13, NB: 0.15, NL: 0.15, NS: 0.15, PE: 0.15 };
const PST_RATES = { BC: 0.07, MB: 0.07, SK: 0.06, QC: 0.09975 };
const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland & Labrador" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NT", name: "Northwest Territories" },
  { code: "YT", name: "Yukon" },
  { code: "NU", name: "Nunavut" },
];

// ── Helper to compute taxes ─────────────────────────────
function computeTaxes(subtotal, province) {
  const gst = subtotal * 0.05;
  let pst = 0;
  if (HST_RATES[province]) pst = subtotal * HST_RATES[province];
  else if (PST_RATES[province]) pst = subtotal * PST_RATES[province];
  return {
    gst: +gst.toFixed(2),
    pst: +pst.toFixed(2),
    total: +(subtotal + gst + pst).toFixed(2),
  };
}

// ── Styled components ──────────────────────────────────
const Page = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 36px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const SectionBody = styled.div`
  padding: 0 24px 24px;
  font-size: 15px;
`;

const ChangeButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 14px;
`;

const ItemsSection = styled(Section)`
  padding: 24px;
  display: flex;
`;

const ItemsList = styled.div`
  flex: 1;
`;

const DeliveryOptions = styled.div`
  flex: 1;
  padding-left: 24px;
  font-size: 15px;
`;

const ItemRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const BoldName = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
`;

const SummarySection = styled(Section)`
  padding: 24px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const SaveBtn = styled.button`
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  background: #ffa733;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

// Modal styles
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 40px 20px;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  padding: 24px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ error }) => (error ? "#e53935" : "#ccc")};
  border-radius: 4px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ error }) => (error ? "#e53935" : "#ccc")};
  border-radius: 4px;
  box-sizing: border-box;
`;

// ── Component ──────────────────────────────────────────
export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart);
  const token = useSelector((s) => s.user.token);

  // Re-fetch cart on mount
  useEffect(() => {
    if (token) {
      fetchCart(token).then(({ data }) => dispatch(loadCart(data)));
    }
  }, [token, dispatch]);

  // Delivery option
  const [deliveryOption, setDeliveryOption] = useState("standard");

  // Saved addresses & payments
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(0);
  const [selectedPayIdx, setSelectedPayIdx] = useState(0);

  // Modals & form state
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("ON");
  const [postalCode, setPostalCode] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState({});

  // Load saved on mount
  useEffect(() => {
    if (!token) return;
    fetchAddresses(token).then(({ data }) => {
      setAddresses(data);
      if (data.length) setSelectedAddrIdx(0);
    });
    fetchPayments(token).then(({ data }) => {
      setPayments(data);
      if (data.length) setSelectedPayIdx(0);
    });
  }, [token]);

  // Validation
  const validateAddress = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Required";
    if (!/^\d{10}$/.test(phone)) e.phone = "10 digits";
    if (!street1.trim()) e.street1 = "Required";
    if (!city.trim()) e.city = "Required";
    if (!/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(postalCode))
      e.postalCode = "Invalid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!cardName.trim()) e.cardName = "Required";
    if (!/^\d{16}$/.test(cardNum)) e.cardNum = "16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) e.expiry = "MM/YY";
    else {
      const [m, y] = expiry.split("/").map(Number);
      const now = new Date();
      const cy = now.getFullYear() % 100;
      const cm = now.getMonth() + 1;
      if (y < cy || (y === cy && m < cm)) e.expiry = "Expired";
    }
    if (!/^\d{3}$/.test(cvv)) e.cvv = "3 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Save handlers
  const saveAddress = async () => {
    if (!validateAddress()) return;
    const addr = {
      fullName,
      phone,
      street: street1 + (street2 ? " " + street2 : ""),
      city,
      province,
      country: "Canada",
      postalCode,
    };
    const { data } = await addAddress(token, addr);
    setAddresses(data);
    setSelectedAddrIdx(data.length - 1);
    setShowAddrModal(false);
  };

  const savePayment = async () => {
    if (!validatePayment()) return;
    const pay = { cardName, cardLast4: cardNum.slice(-4), expiry };
    const { data } = await addPayment(token, pay);
    setPayments(data);
    setSelectedPayIdx(data.length - 1);
    setShowPayModal(false);
  };

  // Compute costs
  const subtotal = +cartItems
    .reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    .toFixed(2);

  const addrProvince = addresses[selectedAddrIdx]?.province || "ON";
  const { gst, pst, total } = computeTaxes(subtotal, addrProvince);

  const shippingFee = deliveryOption === "2-day" ? 4.99 : 0;
  const orderTotal = +(total + shippingFee).toFixed(2);

  // Place order
  const handlePlaceOrder = async () => {
    if (!token) {
      dispatch(openSnackbar({ message: "Please sign in", severity: "info" }));
      return navigate("/signin");
    }
    // require at least one address & payment
    if (!addresses.length || !payments.length) {
      dispatch(
        openSnackbar({
          message: "Add an address and payment method first",
          severity: "error",
        })
      );
      return;
    }
    const res = await placeOrder(token, {
      items: cartItems.map((i) => ({
        id: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      total: orderTotal,
      address: {
        street: addresses[selectedAddrIdx].street,
        city: addresses[selectedAddrIdx].city,
        province: addresses[selectedAddrIdx].province,
        country: addresses[selectedAddrIdx].country,
        postalCode: addresses[selectedAddrIdx].postalCode,
      },
      phone: addresses[selectedAddrIdx].phone,
      payment: {
        method: "card",
        cardLast4: payments[selectedPayIdx].cardLast4,
        expiry: payments[selectedPayIdx].expiry,
      },
    });
    const order = res.data.order;
    dispatch(clearCart());
    navigate(`/order-success/${order._id}`, { state: { order } });
    dispatch(openSnackbar({ message: "Order placed!", severity: "success" }));
  };

  return (
    <Page>
      {/* Addresses */}
      <Section>
        <SectionHeader>
          <SectionTitle>Delivering to:</SectionTitle>
          <ChangeButton onClick={() => setShowAddrModal(true)}>
            Add another
          </ChangeButton>
        </SectionHeader>
        <SectionBody>
          {addresses.length
            ? addresses.map((a, idx) => (
                <label key={idx} style={{ display: "block", marginBottom: 6 }}>
                  <input
                    type="radio"
                    checked={selectedAddrIdx === idx}
                    onChange={() => setSelectedAddrIdx(idx)}
                  />{" "}
                  {a.fullName}, {a.street}, {a.city}, {a.province},{" "}
                  {a.postalCode}, {a.phone}
                </label>
              ))
            : "No address saved"}
        </SectionBody>
      </Section>

      {/* Payments */}
      <Section>
        <SectionHeader>
          <SectionTitle>Paying with:</SectionTitle>
          <ChangeButton onClick={() => setShowPayModal(true)}>
            Add another
          </ChangeButton>
        </SectionHeader>
        <SectionBody>
          {payments.length
            ? payments.map((p, idx) => (
                <label key={idx} style={{ display: "block", marginBottom: 6 }}>
                  <input
                    type="radio"
                    checked={selectedPayIdx === idx}
                    onChange={() => setSelectedPayIdx(idx)}
                  />{" "}
                  Card ****{p.cardLast4}, exp {p.expiry}
                </label>
              ))
            : "No payment method"}
        </SectionBody>
      </Section>

      {/* Items & Delivery */}
      <ItemsSection>
        <ItemsList>
          {cartItems.map((i) => (
            <ItemRow key={i.product._id}>
              <ItemImage src={i.product.image} alt={i.product.name} />
              <div>
                <BoldName>{i.product.name}</BoldName>
                <div>
                  {i.quantity} × ${i.product.price.toFixed(2)}
                </div>
              </div>
            </ItemRow>
          ))}
        </ItemsList>
        <DeliveryOptions>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Choose delivery:
          </div>
          <label style={{ display: "block", marginBottom: 6 }}>
            <input
              type="radio"
              checked={deliveryOption === "2-day"}
              onChange={() => setDeliveryOption("2-day")}
            />{" "}
            2-Day ($4.99)
          </label>
          <label style={{ display: "block" }}>
            <input
              type="radio"
              checked={deliveryOption === "standard"}
              onChange={() => setDeliveryOption("standard")}
            />{" "}
            Standard (Free, 5–7 days)
          </label>
        </DeliveryOptions>
      </ItemsSection>

      {/* Summary */}
      <SummarySection>
        <SectionTitle>Order Summary</SectionTitle>
        <SummaryItem>
          <span>Items:</span>
          <span>${subtotal.toFixed(2)}</span>
        </SummaryItem>
        <SummaryItem>
          <span>Shipping:</span>
          <span>${shippingFee.toFixed(2)}</span>
        </SummaryItem>
        <SummaryItem>
          <span>GST (5%):</span>
          <span>${gst.toFixed(2)}</span>
        </SummaryItem>
        <SummaryItem>
          <span>
            {HST_RATES[addrProvince]
              ? `HST ${(HST_RATES[addrProvince] * 100).toFixed(0)}%:`
              : addrProvince === "QC"
              ? "QST (9.975%):"
              : "PST:"}
          </span>
          <span>${pst.toFixed(2)}</span>
        </SummaryItem>
        <hr />
        <SummaryItem style={{ fontWeight: 700 }}>
          <span>Total:</span>
          <span>${orderTotal.toFixed(2)}</span>
        </SummaryItem>
        <SaveBtn onClick={handlePlaceOrder}>Place Your Order</SaveBtn>
      </SummarySection>

      {/* Address Modal */}
      {showAddrModal && (
        <Overlay onClick={() => setShowAddrModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={() => setShowAddrModal(false)}>×</CloseBtn>
            <h2>Edit your shipping address</h2>
            <FormGroup>
              <Label>Full name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={!!errors.fullName}
              />
              {errors.fullName && (
                <small style={{ color: "#e53935" }}>{errors.fullName}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Phone number</Label>
              <Input
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                error={!!errors.phone}
              />
              {errors.phone && (
                <small style={{ color: "#e53935" }}>{errors.phone}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Address line 1</Label>
              <Input
                value={street1}
                onChange={(e) => setStreet1(e.target.value)}
                error={!!errors.street1}
              />
              {errors.street1 && (
                <small style={{ color: "#e53935" }}>{errors.street1}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Address line 2 (optional)</Label>
              <Input
                placeholder="Apt, suite, etc."
                value={street2}
                onChange={(e) => setStreet2(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={!!errors.city}
              />
              {errors.city && (
                <small style={{ color: "#e53935" }}>{errors.city}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Province/Territory</Label>
              <Select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Postal code</Label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                error={!!errors.postalCode}
              />
              {errors.postalCode && (
                <small style={{ color: "#e53935" }}>{errors.postalCode}</small>
              )}
            </FormGroup>
            <SaveBtn onClick={saveAddress}>Use this address</SaveBtn>
          </Modal>
        </Overlay>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <Overlay onClick={() => setShowPayModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={() => setShowPayModal(false)}>×</CloseBtn>
            <h2>Add a credit or debit card</h2>
            <FormGroup>
              <Label>Card number*</Label>
              <Input
                maxLength={16}
                value={cardNum}
                onChange={(e) => setCardNum(e.target.value.replace(/\D/g, ""))}
                error={!!errors.cardNum}
              />
              {errors.cardNum && (
                <small style={{ color: "#e53935" }}>{errors.cardNum}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Expiration (MM/YY)*</Label>
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                error={!!errors.expiry}
              />
              {errors.expiry && (
                <small style={{ color: "#e53935" }}>{errors.expiry}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Name on card*</Label>
              <Input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                error={!!errors.cardName}
              />
              {errors.cardName && (
                <small style={{ color: "#e53935" }}>{errors.cardName}</small>
              )}
            </FormGroup>
            <FormGroup>
              <Label>CVV*</Label>
              <Input
                type="password"
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                error={!!errors.cvv}
              />
              {errors.cvv && (
                <small style={{ color: "#e53935" }}>{errors.cvv}</small>
              )}
            </FormGroup>
            <SaveBtn onClick={savePayment}>Add and continue</SaveBtn>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
