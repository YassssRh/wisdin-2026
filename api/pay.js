// api/pay.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { amount, email } = req.body; // amount en euros

  // 1) OAuth2 client_credentials
  const tokenRes = await fetch("https://api.helloasso.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HELLOASSO_CLIENT_ID,
      client_secret: process.env.HELLOASSO_CLIENT_SECRET,
    }),
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;
  if (!accessToken) return res.status(500).json({ error: "Token HelloAsso manquant" });

  // 2) Créer l’intention de paiement (adapter endpoint/payload selon la doc HelloAsso v5)
  const orderRes = await fetch("https://api.helloasso.com/v5/organizations/TON_ORGA/events/TON_EVENT/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      items: [
        {
          name: "Inscription WISDIN",
          amount: Math.round(amount * 100), // centimes
          quantity: 1,
        },
      ],
      payer: { email },
      successUrl: "https://wisdin-2026.vercel.app/merci",
      cancelUrl: "https://wisdin-2026.vercel.app/erreur",
    }),
  });
  const orderJson = await orderRes.json();
  const redirectUrl = orderJson.redirectUrl || orderJson.paymentUrl || orderJson.url;
  if (!redirectUrl) return res.status(500).json({ error: "URL de paiement non reçue" });

  return res.status(200).json({ redirectUrl });
}
