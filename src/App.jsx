import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ChatModal from './components/ChatModal';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import AccountPage from './pages/AccountPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

function AppInner() {
    const [chatOpen, setChatOpen] = useState(false);
    const location = useLocation();

    const isAdmin = location.pathname.startsWith('/admin');

    const getActivePage = () => {
        if (location.pathname === '/') return 'Home';
        if (location.pathname === '/categories') return 'Categories';
        if (location.pathname === '/products') return 'All Products';
        if (location.pathname === '/account') return 'Account';
        return '';
    };

    return (
        <>
            {!isAdmin && <Navbar onChatOpen={() => setChatOpen(true)} activePage={getActivePage()} />}
            {!isAdmin && <CartDrawer />}
            {!isAdmin && <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/products" element={<AllProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/account" element={<AccountPage onChatOpen={() => setChatOpen(true)} />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>

            {!isAdmin && <Footer />}
        </>
    );
}

export default function App() {
    return (
        <DataProvider>
            <CartProvider>
                <AppInner />
            </CartProvider>
        </DataProvider>
    );
}
