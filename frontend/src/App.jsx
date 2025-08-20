
import { replace, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Product from "./pages/Product";

import Modal2 from "./components/Modal2";

import Navbar from "./components/Navbar";
import GitHubFloatButton from "./components/GitHubFloatButton";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import MyListings from "./pages/MyListings";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import AddListing from "./pages/AddListing";
import { Children, useEffect } from "react";
import useShopStore from "./store/shopStore";
import { Navigate } from "react-router-dom";
import { FullScreenLoader } from "./components/ui/LoadingSpinner"
import MyProfile from "./pages/MyProfile";
import IntrestedList from "./pages/IntrestedList";

function App() {
  const { listProducts, products, checkAuth, isAuthenticated, isCheckingAuth } = useShopStore()



  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated } = useShopStore()
    if (isAuthenticated) {
      return <Navigate to="/" replace />
    }
    return children
  }
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useShopStore()
    if (!isAuthenticated) {
      return <Navigate to='/' replace />
    }
    return children
  }

  useEffect(() => {
    if (products.length === 0) {
      listProducts()
    }
  }, [])

  if (isCheckingAuth) return <FullScreenLoader message="Checking authentication..." />
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <GitHubFloatButton />
      <Modal2>
        <Login />
      </Modal2>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/add-listing" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
        <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/interest" element={<ProtectedRoute><IntrestedList /></ProtectedRoute>} />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;
