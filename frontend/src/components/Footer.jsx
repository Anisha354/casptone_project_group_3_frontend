import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterestP,
} from "react-icons/fa";

/* 1️⃣  Section is explicitly position: static  */
const Section = styled.section`
  position: static !important; /* overrides any global “fixed” rule */
  width: 100%;
  background: #1a1a1a;
  color: #fff;
  padding: 40px 20px 10px;
`;

/* Wrap for the four columns */
const FlexContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
`;

/* utilities */
const hover = (e, clr) => (e.currentTarget.style.color = clr);
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const socialLinks = [
  { Icon: FaFacebookF, url: "https://facebook.com" },
  { Icon: FaInstagram, url: "https://instagram.com" },
  { Icon: FaTwitter, url: "https://twitter.com" },
  { Icon: FaPinterestP, url: "https://pinterest.com" },
];

const quickLinks = [
  { text: "Home", to: "/" },
  { text: "Shop", to: "/products" },
  { text: "Favourites", to: "/favourites" },
  { text: "Cart", to: "/cart" },
  { text: "Contact", to: "/contact" },
];

const customerCareLinks = [
  { text: "FAQs", to: "/faqs" },
  { text: "Shipping & Returns", to: "/shipping-returns" },
  { text: "Size Guide", to: "/size-guide" },
  { text: "Privacy Policy", to: "/privacy-policy" },
  { text: "Terms & Conditions", to: "/terms-conditions" },
];

const Footer = () => (
  <Section>
    <FlexContainer>
      {/* Brand + Social */}
      <div style={{ flex: "1 1 220px", minWidth: 220 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: "#ff4081",
          }}
        >
          Dresses&nbsp; Fashion Store
        </h2>
        <p style={{ fontSize: 14, lineHeight: "1.7", color: "#bbbbbb" }}>
          Curated collections of elegant dresses for every occasion. Fashion
          that empowers you to shine.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          {socialLinks.map(({ Icon, url }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ffffff" }}
            >
              <Icon
                style={{ fontSize: 18, cursor: "pointer" }}
                onMouseOver={(e) => hover(e, "#ff4081")}
                onMouseOut={(e) => hover(e, "#ffffff")}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ flex: "1 1 160px", minWidth: 160 }}>
        <h4 style={{ marginBottom: 12 }}>Quick Links</h4>
        {quickLinks.map(({ text, to }) => (
          <Link
            key={text}
            to={to}
            onClick={scrollTop}
            style={{ textDecoration: "none", display: "block" }}
          >
            <span
              style={{
                fontSize: 14,
                margin: "6px 0",
                color: "#bbbbbb",
                cursor: "pointer",
              }}
              onMouseOver={(e) => hover(e, "#ff4081")}
              onMouseOut={(e) => hover(e, "#bbbbbb")}
            >
              {text}
            </span>
          </Link>
        ))}
      </div>

      {/* Customer Care */}
      <div style={{ flex: "1 1 180px", minWidth: 180 }}>
        <h4 style={{ marginBottom: 12 }}>Customer Care</h4>
        {customerCareLinks.map(({ text, to }) => (
          <Link
            key={text}
            to={to}
            onClick={scrollTop}
            style={{ textDecoration: "none", display: "block" }}
          >
            <span
              style={{
                fontSize: 14,
                margin: "6px 0",
                color: "#bbbbbb",
                cursor: "pointer",
              }}
              onMouseOver={(e) => hover(e, "#ff4081")}
              onMouseOut={(e) => hover(e, "#bbbbbb")}
            >
              {text}
            </span>
          </Link>
        ))}
      </div>

      {/* Get in Touch */}
      <div style={{ flex: "1 1 220px", minWidth: 220 }}>
        <h4 style={{ marginBottom: 12 }}>Get in Touch</h4>
        {[
          "support@dressesfashionstore.com",
          "+1 (555) 123-4567",
          "274 Colbrone Street, Brantford, ON",
        ].map((item) => {
          let href;
          if (item.includes("@")) {
            href = `mailto:${item}`;
          } else if (/^[\d+\-\s()]+$/.test(item)) {
            const clean = item.replace(/[^\d+]/g, "");
            href = `tel:${clean}`;
          } else {
            const q = encodeURIComponent(item);
            href = `https://www.google.com/maps/search/?api=1&query=${q}`;
          }
          const external =
            !href.startsWith("mailto:") && !href.startsWith("tel:");
          return (
            <a
              key={item}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              style={{
                textDecoration: "none",
                color: "#bbbbbb",
                display: "block",
                margin: "6px 0",
                fontSize: 14,
              }}
              onMouseOver={(e) => hover(e, "#ff4081")}
              onMouseOut={(e) => hover(e, "#bbbbbb")}
            >
              {item}
            </a>
          );
        })}
      </div>
    </FlexContainer>

    <div
      style={{
        textAlign: "center",
        marginTop: 30,
        fontSize: 13,
        color: "#777777",
      }}
    >
      © 2025 Dresses Fashion Store. All rights reserved.
    </div>
  </Section>
);

export default Footer;
