// File: src/types/sslcommerz-lts.d.ts

declare module "sslcommerz-lts" {
  interface SSLCommerzPaymentResponse {
    GatewayPageURL: string;
    // Add other response properties as needed
  }

  class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, isLive: boolean);
    init(data: any): Promise<SSLCommerzPaymentResponse>;
    // Add other methods as needed
  }
}
