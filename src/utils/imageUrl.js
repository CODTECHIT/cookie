export const getSafeImageUrl = (url, fallback = "/placeholder-product.png") => {
  if (!url || typeof url !== "string") return fallback;

  // Old seeded/broken localhost image entries should not be requested in browser.
  if (/^https?:\/\/localhost:\d+\//i.test(url)) return fallback;

  // ⚡ Mixed-content hardening: Upgrade http to https automatically on production
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    url.startsWith("http://")
  ) {
    return url.replace("http://", "https://");
  }

  return url;
};
