import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const addToCart = useCallback((product) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQty = useCallback((id, qty) => {
        if (qty < 1) {
            setItems(prev => prev.filter(i => i.id !== id));
            return;
        }
        setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
