const fallbackSiteUrl = "http://localhost:3000";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl
).replace(/\/+$/, "");

export const brandName = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Undangan Digital";
