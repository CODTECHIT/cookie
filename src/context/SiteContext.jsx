/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const SiteContext = createContext();

export const useSite = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

  const fetchSiteData = useCallback(async () => {
    try {
      // ⚡ Optimized Boot: ONE request for ALL critical storefront data
      const { data } = await axios.get(`${API_URL}/site/bootstrap`, {
        params: { t: Date.now() },
      });

      if (data.success) {
        const {
          settings,
          categories,
          coupons,
          banners,
          featuredProducts,
          bestSellers,
        } = data.data;
        setSettings(settings);
        setCategories(categories || []);
        setBanners(banners || []);
        setBestSellers(bestSellers || []);
        setFeaturedProducts(featuredProducts || []);

        // Filter active/valid coupons
        if (coupons) {
          const activeCoupons = coupons.filter(
            (c) =>
              c.isActive &&
              new Date() <= new Date(c.validUntil) &&
              new Date() >= new Date(c.validFrom),
          );
          setCoupons(activeCoupons);
        }
      }
    } catch (err) {
      console.error("Error fetching site data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  return (
    <SiteContext.Provider
      value={{
        settings,
        categories,
        coupons,
        banners,
        bestSellers,
        featuredProducts,
        loading,
        API_URL,
        refreshSiteData: fetchSiteData,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
