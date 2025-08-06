import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import { useState } from "react";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ContactUs from "./pages/ContactUs";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
import SignInPage from "./pages/SignInPage";
import Checkout from "./pages/Checkout";
import CartPersistor from "./components/CartPersistor";
import AppSnackbar from "./components/AppSnackbar";
import OrderSuccess from "./pages/OrderSuccess";
import Favourites from "./pages/Favourites";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
`;

const Main = styled.main`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        {/* this will auto-load/auto-save per-user */}
        <CartPersistor />
        <ScrollToTop />
        <Container>
          <Navbar setOpenAuth={setOpenAuth} currentUser={currentUser} />
          <Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />

              <Route path="/signin" element={<SignInPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Routes>
            <AppSnackbar />
            {openAuth && (
              <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />
            )}
          </Main>
          <Footer />
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
