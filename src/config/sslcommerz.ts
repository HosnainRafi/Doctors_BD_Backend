import config from "../app/config";

export const SSLCommerzConfig = {
  store_id: config.store_id || "testbox",
  store_password: config.store_pass || "testbox",
  is_live: config.ssl_is_live === "true",
  success_url: `${process.env.BACKEND_URL}/api/v1/payment/success`,
  fail_url: `${process.env.BACKEND_URL}/api/v1/payment/fail`,
  cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/cancel`,
  ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/ipn`,
  frontend_success_url: `${process.env.FRONTEND_URL}/dashboard/user/appointment?payment=success`,
  frontend_fail_url: `${process.env.FRONTEND_URL}/dashboard/user/appointment?payment=fail`,
  frontend_cancel_url: `${process.env.FRONTEND_URL}/dashboard/user/appointment?payment=cancel`,
};
