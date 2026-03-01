import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategories, fetchProducts, fetchHeroSlides, fetchTickerItems } from '../lib/productsService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [data, setData] = useState({
        categories: [],
        products: [],
        heroSlides: [],
        tickerItems: [],
        loading: true,
    });

    useEffect(() => {
        let mounted = true;
        async function loadAll() {
            const [cRes, pRes, hRes, tRes] = await Promise.all([
                fetchCategories(),
                fetchProducts({ limit: 500 }),
                fetchHeroSlides(),
                fetchTickerItems()
            ]);

            if (mounted) {
                setData({
                    categories: cRes.data || [],
                    products: pRes.data || [],
                    heroSlides: hRes.data || [],
                    tickerItems: tRes.data || [],
                    loading: false,
                });
            }
        }
        loadAll();
        return () => { mounted = false; };
    }, []);

    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
};
