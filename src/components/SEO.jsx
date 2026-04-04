import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEO Component with comprehensive meta tags, Open Graph, Twitter Cards, and Schema.org structured data
 *
 * @param {Object} props - Props object
 * @param {string} props.title - Page title (will be auto-branded)
 * @param {string} props.description - Meta description (150-160 chars ideal)
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.image - OG image URL (1200x630px ideal)
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (website|product|article|business.business)
 * @param {Object} props.schema - JSON-LD structured data
 * @param {boolean} props.noIndex - Set to true to exclude from search engines
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  schema = null,
  noIndex = false,
}) => {
  const siteTitle = "Daksha Cookies & Millets";
  const siteTagline = "Premium Artisanal Hearth & Heritage";
  const fullTitle = title
    ? `${title} | ${siteTitle}`
    : `${siteTitle} | ${siteTagline}`;
  const defaultDesc =
    "Authentic, health-conscious artisanal treats including millet-based cookies and traditional snacks from the heart of Andhra Pradesh. Handcrafted with soul.";
  const siteUrl = window.location.origin;
  const canonicalUrl =
    url || (typeof window !== "undefined" ? window.location.href : siteUrl);
  
  const defaultKeywords = "handcrafted cookies, millet snacks, healthy millets, organic cookies, Andhra Pradesh traditional snacks, artisanal food, buy cookies online, healthy millet powders, Daksha cookies, nutritious snacks, gluten-free cookies India, cashew cookies, ragi malt powder, homemade cookies, premium cookies, gift cookies, bulk cookies, traditional snacks India, millet health drinks, organic millets";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteTitle,
    description: defaultDesc,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://www.instagram.com/daksha",
      "https://www.facebook.com/daksha",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nuzvidu, Eluru",
      addressLocality: "Andhra Pradesh",
      postalCode: "517590",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+919704254959",
      email: "dakshacookiesmillets@gmail.com",
    },
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteTitle,
    image: `${siteUrl}/logo.png`,
    description: defaultDesc,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nuzvidu, Eluru",
      addressLocality: "Andhra Pradesh",
      addressCountry: "IN",
    },
    telephone: "+919704254959",
    priceRange: "₹99 - ₹999",
  };

  // Breadcrumb Schema (if needed)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
    ],
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteTitle,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={finalKeywords} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <meta name="language" content="English" />
      <meta name="author" content={siteTitle} />
      <meta name="revisit-after" content="7 days" />
      <meta name="copyright" content={`${siteTitle} © ${new Date().getFullYear()}`} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      {image ? (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={fullTitle} />
        </>
      ) : (
        <meta property="og:image" content={`${siteUrl}/assets/og-image.png`} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {image ? (
        <meta name="twitter:image" content={image} />
      ) : (
        <meta name="twitter:image" content={`${siteUrl}/assets/og-image.png`} />
      )}
      <meta name="twitter:site" content="@daksha" />
      <meta name="twitter:creator" content="@daksha" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#331917" />
      <meta name="msapplication-TileColor" content="#331917" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      <meta name="format-detection" content="telephone=no" />

      {/*geo.tags*/}
      <meta name="geo.region" content="IN-AP" />
      <meta name="geo.placename" content="Nuzvidu, Eluru" />
      <meta name="geo.position" content="16.7839;80.6216" />
      <meta name="ICBM" content="16.7839, 80.6216" />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* JSON-LD Structured Data */}
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Custom Schema if provided */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
