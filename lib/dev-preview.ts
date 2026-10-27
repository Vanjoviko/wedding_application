import { notFound } from "next/navigation";

/**
 * Halaman bantu desain hanya untuk development dan preview deployment.
 * Production tetap 404 sesuai docs/PRD.md § M1.
 */
export function assertDevPreview() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

  if (!isDevelopment && !isPreviewDeployment) {
    notFound();
  }
}
