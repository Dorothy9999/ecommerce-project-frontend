import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ProductListing from "./ui/page/ProductListing";
import NavbarTop from "./ui/component/NavbarTop";
import ProductDetails from "./ui/page/ProductDetails";
import {BrowserRouter, Routes, Route, HashRouter} from "react-router-dom";
import ErrorPage from "./ui/page/ErrorPage";
import LoginPage from "./ui/page/LoginPage";
import {firebaseAuthServiceOnAuthStateChanged} from "./service/AuthService";
import LoadingSpinner from "./ui/component/LoadingSpinner";
import CheckoutPage from "./ui/page/CheckoutPage";
import CartPage from "./ui/page/CartPage";
import ThankYou from "./ui/page/ThankYou";



function App() {

    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    //check if auth is done, then 先load成版website出黎
    useEffect(()=>{
        firebaseAuthServiceOnAuthStateChanged(()=>{
            setIsInitialized(true);
        })
    })
  return (
      <>
          {(isInitialized)
          ? <div className="App">
                  <HashRouter>
                      <Routes>
                          <Route path="/" element={<ProductListing/>}/>
                          <Route path="/product/:productId" element={<ProductDetails/>}/>
                          <Route path="/login" element={<LoginPage/>}/>
                          <Route path="/checkout/:transactionId" element={<CheckoutPage/>}/>
                          <Route path="/thankyou" element={<ThankYou/>}/>
                          <Route path="/404" element={<ErrorPage/>}/>
                      </Routes>
                  </HashRouter>
              </div>
          :<LoadingSpinner/>}
      </>
  );
}

export default App;
