import logo from './logo.svg';
import './App.css';
import React from 'react';
import NavigationBar from './components/navigationbar/NavigationBar';
import LoginPage from './components/login-page/LoginPage';
import SignUpPage from './components/signup-page/SignupPage';
import Home from './components/home/Home';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import AddProductsPage from './components/add-products-page/AddProductsPage';
import ProductDetailsPage from './components/product-detail-page/ProductDetailPage';
import AddressPage from './components/address-page/AddressPage';
import PlaceOrderPage from './components/place-order-page/PlaceOrderPage';


import { AuthProvider } from './contexts/AuthContext';

function App() {

  function RedirectToLogin() {
    const navigate = useNavigate();
  
    useEffect(() => {
      // Redirect to login page when the application starts
      navigate('/login');
    }, [navigate]);

    return null; // or you can return a loading spinner or a message
  }

  return (
    <AuthProvider>
    <Router>
      <NavigationBar isLoggedIn={true} isAdmin={true} />
      <Routes>
        <Route path="/" element={<RedirectToLogin />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-products" element={<AddProductsPage isModifyPage={false}/>} />
        <Route path="/modify-product/:id" element={<AddProductsPage isModifyPage={true}/>} />
        <Route path="/product-detail-page/:id" element={<ProductDetailsPage/>} />
        <Route path="/search/:name" element={<Home />} />
        <Route path="/category/:name" element={<Home />} />
        <Route path="/address-page/:productid/:quantity" element={<AddressPage/>} />
        <Route path="/confirm-order/:productid/:quantity/:addressid" element={<PlaceOrderPage/>} />
        
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;