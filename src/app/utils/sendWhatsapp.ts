import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

let client: Client | null = null;
let isReady = false;

export function initWhatsappClient() {
  if (client) return client;
  client = new Client({}); // Pass empty options object

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Scan the QR code above with your WhatsApp app.");
  });

  client.on("ready", () => {
    isReady = true;
    console.log("WhatsApp client is ready!");
  });

  client.initialize();
  return client;
}

export async function sendWhatsapp(to: string, message: string) {
  if (!client) initWhatsappClient();
  if (!isReady) {
    throw new Error("WhatsApp client is not ready yet. Wait for QR scan.");
  }
  // WhatsApp number format: countrycode + number + @c.us (e.g. 8801XXXXXXXXX@c.us)
  if (!to.endsWith("@c.us")) {
    to = to.replace(/^\+/, "") + "@c.us";
  }
  return client!.sendMessage(to, message);
}
