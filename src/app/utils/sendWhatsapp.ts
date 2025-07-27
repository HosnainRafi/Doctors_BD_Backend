import axios from "axios";
import { unknown } from "zod";

export async function sendWhatsappWithUltraMsg(to: string, message: string) {
  const instanceId = "YOUR_INSTANCE_ID";
  const token = "YOUR_TOKEN";
  const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;

  try {
    const response = await axios.post(
      url,
      {
        token,
        to: to.startsWith("+") ? to : `+${to}`,
        body: message,
        priority: 10,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent:", response.data);
    return true;
  } catch (err: any) {
    console.error(
      "❌ Error sending WhatsApp:",
      err.response?.data || err.message
    );
    return false;
  }
}
