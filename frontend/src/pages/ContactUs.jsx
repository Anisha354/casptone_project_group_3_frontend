import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice";

const Page = styled.div`
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 24px;
  display: flex;
  gap: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const Left = styled.div`
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  gap: 34px;
`;

const Right = styled.div`
  flex: 1 1 60%;
  margin-left: 100px;
  min-height: 460px;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 14px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px 22px;
  font-size: 15px;
  line-height: 1.5;
  h4 {
    margin: 0;
    font-weight: 600;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.text_secondary + 90};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;

  label {
    font-size: 14px;
    margin-bottom: 6px;
  }
  input,
  textarea {
    width: 100%;
    font-size: 15px;
    padding: 12px 16px;
    border: 1px solid ${({ theme }) => theme.text_secondary + 40};
    border-radius: 8px;
    &:focus {
      outline: 2px solid ${({ theme }) => theme.primary + 60};
    }
  }
  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const InlineMsg = styled.p`
  font-size: 14px;
  color: #4caf50;
  margin: 0;
`;

const ContactUs = () => {
  const dispatch = useDispatch();
  const [sent, setSent] = useState(false);
  const [loading, setLoad] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setSent(false);

    const form = new FormData(e.target);
    const payload = Object.fromEntries(form);
    try {
      await api.post("/api/contact", payload);
      setSent(true);
      e.target.reset();
      dispatch(
        openSnackbar({
          message: "Your Query has been sent",
          severity: "success",
        })
      );
    } catch {
      dispatch(openSnackbar({ message: "Unable to send", severity: "error" }));
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: 40, marginBottom: 10 }}>
        We’d love to hear from you
      </h1>

      <Page>
        {}
        <Left>
          <InfoGrid>
            <h4>Address:</h4>
            <p>1234 Main St, Brantford, Ontario</p>
            <h4>Phone:</h4> <p>+1&nbsp;(234)&nbsp;567-8901</p>
            <h4>Email:</h4> <p>contact@conestoga.com</p>
          </InfoGrid>

          {/* form */}
          <Form onSubmit={submit}>
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" required placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                required
                placeholder="Subject"
              />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="Your message…"
              />
            </div>

            {sent && <InlineMsg>Feedback sent&nbsp;✓</InlineMsg>}

            <Button text="Send message" type="submit" isLoading={loading} />
          </Form>
        </Left>

        {/* ───── right column ───── */}
        <Right>
          <iframe
            title="Company location"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2871.425705073376!2d-80.25849202378896!3d43.14151157113659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c65ff85915f9f%3A0x7e71fb944f1525c0!2s1234%20Main%20St%2C%20Brantford%2C%20ON!5e0!3m2!1sen!2sca!4v1720880000000"
          />
        </Right>
      </Page>
    </>
  );
};

export default ContactUs;
