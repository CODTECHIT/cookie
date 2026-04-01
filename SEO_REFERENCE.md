# 🎯 SEO Reference - Meta Tags Quick Guide

## Page-by-Page SEO Implementation

### 1. Home Page (`/`)

```jsx
<SEO
  title="Artisanal Cookies & Healthy Millet Powders"
  description="Discover the authentic taste of Daksha Food Artisan. Handcrafted cashew cookies, nutrient-rich millets, and traditional snacks."
  keywords="cookies, millets, handcrafted, artisanal, healthy, snacks, organic, Andhra Pradesh"
  image="/assets/home-hero-cinematic.png"
  type="website"
/>
```

### 2. Products Page (`/products`)

```jsx
<SEO
  title="Shop Handcrafted Cookies & Millet Products - Daksha"
  description="Browse our exquisite collection of handcrafted artisanal cookies and nutritious millet-based products. Organic, fresh, traditional flavors."
  keywords="artisanal cookies, millet powder, healthy snacks, organic treats, handcrafted products"
  image="/assets/product-hero.png"
/>
```

### 3. Product Detail Page (`/product/:id`)

```jsx
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.images[0].url,
  price: product.variants[0].price,
  priceCurrency: "INR",
  brand: { "@type": "Brand", name: "Daksha Food Artisan" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviews,
  },
};

<SEO
  title={`${product.name} - Handcrafted Artisanal Cookies | Daksha`}
  description={
    product.shortDescription ||
    `Discover this premium ${product.name} - crafted with organic ingredients for authentic taste and nutrition.`
  }
  keywords={`${product.name}, cookies, millets, artisanal, organic, handcrafted`}
  image={product.images[0]?.url}
  type="product"
  schema={productSchema}
/>;
```

### 4. Category Page (`/category/:slug`)

```jsx
<SEO
  title={`${category.name} - Handcrafted Collection | Daksha`}
  description={`Explore our ${category.name} collection - premium artisanal products crafted with organic ingredients and traditional recipes.`}
  keywords={`${category.name}, cookies, millets, artisanal, health snacks, organic`}
  image={category.image}
/>
```

### 5. About Page (`/about`)

```jsx
<SEO
  title="Our Story | The Daksha Heritage - Artisanal Excellence"
  description="Discover the legacy of Daksha Cookies & Millets. Where traditional wisdom meets modern wellness innovation. Handcrafted since 2024."
  keywords="Daksha, artisanal, heritage, handcrafted cookies, millets, family business, Andhra Pradesh, tradition"
  image="/assets/heritage-kitchen.png"
  type="business.business"
/>
```

### 6. Services Page (`/services`)

```jsx
<SEO
  title="Our Services - Daksha Food Artisan"
  description="Discover our premium services: artisan cookie crafting, custom packaging, bulk orders, corporate gifting, and healthy snack solutions."
  keywords="custom cookies, bulk orders, corporate gifts, packaging, private labeling, artisan services"
/>
```

### 7. Login Page (`/login`)

```jsx
<SEO
  title="Sign In - Daksha Food Artisan Account"
  description="Log in to your Daksha Food Artisan account to track orders and manage your preferences for handcrafted cookies and millet products."
  keywords="login, sign in, Daksha, account, order tracking"
  url={`${window.location.origin}/login`}
/>
```

### 8. Register Page (`/register`)

```jsx
<SEO
  title="Create Account - Daksha Food Artisan"
  description="Register for a Daksha Food Artisan account to shop handcrafted cookies, millet products, and enjoy personalized recommendations."
  keywords="register, sign up, create account, Daksha, cookies, millets"
  url={`${window.location.origin}/register`}
/>
```

### 9. Cart Page (`/cart`)

```jsx
<SEO
  title="Shopping Cart - Daksha Food Artisan"
  description="Review and manage your shopping cart. Add, remove, or update quantities of our handcrafted cookies and millet products before checkout."
  keywords="shopping cart, bag, items, checkout, order"
  url={`${window.location.origin}/cart`}
/>
```

### 10. My Orders Page (`/my-orders`)

```jsx
<SEO
  title="My Orders - Track Your Daksha Shipments"
  description="View and track your orders from Daksha Food Artisan. Monitor shipment status and manage your purchases."
  keywords="my orders, order tracking, shipment status, order history"
  url={`${window.location.origin}/my-orders`}
/>
```

### 11. Privacy Policy Page (`/privacy-policy`)

```jsx
<SEO
  title="Privacy Policy - Daksha Food Artisan"
  description="Learn how Daksha Food Artisan collects, uses, and protects your personal data. Our commitment to your privacy and secure shopping."
  keywords="privacy policy, data protection, personal information, security, GDPR"
  url={`${window.location.origin}/privacy-policy`}
  noIndex={false}
/>
```

---

## 🔑 Keyword Categories

### E-commerce Keywords

- "buy handcrafted cookies online"
- "order millet products India"
- "artisanal snacks delivery"
- "healthy cookie shop"

### Product Keywords

- "cashew cookies"
- "millet powder"
- "traditional snacks"
- "organic treats"
- "whole wheat cookies"

### Health Keywords

- "healthy cookies"
- "sugar-free snacks"
- "organic millet flour"
- "nutritious treats"
- "diabetes-friendly cookies"

### Location Keywords

- "cookies delivery Andhra Pradesh"
- "artisanal snacks Nuzvidu"
- "healthy sweets Eluru"
- "organic products Hyderabad"

### Intent-Based Keywords

- Purchase: "buy handcrafted cookies"
- Information: "health benefits of millets"
- Navigation: "Daksha cookies near me"
- Comparison: "best organic cookies online"

---

## 📊 SEO Metrics to Track

### Google Search Console

- Impressions (how many times shown in search)
- Clicks (actual visits from search)
- CTR (Click-Through Rate, target >5%)
- Average Position (rank, target page 1-3)

### Keywords Performance

- Primary keyword: "handcrafted cookies" - Target: Position #5 in 3 months
- Primary keyword: "artisanal snacks" - Target: Position #10 in 3 months
- Long-tail: "healthy millet cookies online" - Target: Position #3 in 6 months

### Traffic Goals

- Month 1: 100-200 organic visits
- Month 3: 500-1000 organic visits
- Month 6: 2000-3000 organic visits
- Month 12: 5000+ organic visits

---

## 🔗 Internal Linking Strategy

### Navigation Links

- Homepage → All category pages
- Category pages → Product pages
- Product pages → Related products
- Blog (future) → Product pages
- About → Services → Homepage

### Link Anchor Text

Instead of: "Click here"
Use: "Shop handcrafted cookies now"

### Example Internal Links

```html
<a href="/products?category=cookies">Handcrafted Cookies Collection</a>
<a href="/product/cashew-cookies-500g">Premium Cashew Cookies</a>
<a href="/about">Learn about our Heritage</a>
```

---

## 🖼️ Image SEO

### Image File Naming

❌ Bad: `image1.jpg`, `photo.png`
✅ Good: `handcrafted-cashew-cookies.jpg`, `millet-powder-organic.png`

### Image Alt Text

```html
<img
  src="cookie.jpg"
  alt="Premium handcrafted cashew cookies made with organic ingredients"
/>
```

### Image Optimization

- Size: Compress to <100KB
- Format: Use WebP with PNG fallback
- Dimensions: Optimized for web (1200px for og:image)
- Quality: High quality but optimized

---

## 🚀 Next Steps

1. **Submit to Google Search Console**
   - Go to: https://search.google.com/search-console
   - Add property: https://yourdomain.com
   - Verify ownership
   - Submit sitemap.xml

2. **Monitor Search Rankings**
   - Set up Google Analytics 4
   - Track organic traffic
   - Monitor keyword rankings
   - Analyze user behavior

3. **Build Authority**
   - Create high-quality content
   - Build backlinks from relevant sites
   - Increase social media presence
   - Encourage customer reviews

4. **Optimize Continuously**
   - Update meta descriptions
   - Refresh content regularly
   - Add new keywords
   - Monitor competitor strategies

---

## 📌 Important Reminders

✅ **DO:**

- Use focus keywords naturally in content
- Keep meta descriptions under 160 characters
- Use descriptive titles (50-60 characters)
- Build quality backlinks
- Update content regularly
- Monitor search performance

❌ **DON'T:**

- Stuff keywords unnaturally
- Duplicate meta descriptions
- Hide text or links
- Buy backlinks
- Cloak content
- Use outdated SEO tactics

---

**Version**: 1.0  
**Last Updated**: April 1, 2026  
**Status**: Ready for Implementation  
**Review Date**: April 15, 2026
