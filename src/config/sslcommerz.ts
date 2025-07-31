// src/config/sslcommerz.ts
import config from "../app/config";

export const SSLCommerzConfig = {
  store_id: config.store_id || "testbox",
  store_password: config.store_pass || "testbox",
  is_live: config.ssl_is_live === "true",

  // Backend URLs (for SSLCommerz callbacks)
  success_url: `${process.env.BACKEND_URL}/api/v1/payment/success`,
  fail_url: `${process.env.BACKEND_URL}/api/v1/payment/fail`,
  cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/cancel`,
  ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/ipn`,

  // Frontend URLs (for user redirects after backend processing)
  frontend_success_url: `${process.env.FRONTEND_URL}/payment/success`,
  frontend_fail_url: `${process.env.FRONTEND_URL}/payment/fail`,
  frontend_cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
};
