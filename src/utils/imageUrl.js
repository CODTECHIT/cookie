export const getSafeImageUrl = (url, fallback = "/placeholder-product.png") => {
  if (!url || typeof url !== "string") return fallback;

  // Old seeded/broken localhost image entries should not be requested in browser.
  if (/^https?:\/\/localhost:\d+\//i.test(url)) return fallback;

  let optimizedUrl = url;

  // ☁️ Cloudinary Auto-Optimization (if detected)
  if (optimizedUrl.includes("res.cloudinary.com") && !optimizedUrl.includes("upload/f_auto")) {
    optimizedUrl = optimizedUrl.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
  }

  // ⚡ Mixed-content hardening: Upgrade http to https automatically on production
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    optimizedUrl.startsWith("http://")
  ) {
    optimizedUrl = optimizedUrl.replace("http://", "https://");
  }

  return optimizedUrl;
};
