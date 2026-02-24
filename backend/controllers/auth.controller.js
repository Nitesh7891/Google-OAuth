import { oauth2client } from "../utils/google.config.js";
import axios from "axios";

export const googleAuthLogin = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        stage: "validation",
        error: "Authorization code missing",
      });
    }

    console.log("\n🟢 STEP 1: Code received");
    console.log("Code:", code);

    console.log("\n🟢 STEP 2: Exchanging code for tokens...");
    const googleRes = await oauth2client.getToken(code);

    console.log("✅ Tokens received from Google");
    console.log("Tokens:", googleRes.tokens);

    oauth2client.setCredentials(googleRes.tokens);

    console.log("\n🟢 STEP 3: Fetching user profile...");
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        params: {
          alt: "json",
          access_token: googleRes.tokens.access_token,
        },
      }
    );

    console.log("✅ User profile received");
    console.log("User:", userRes.data);

    const { email, name, picture } = userRes.data;

    res.status(200).json({
      message: "Google login successful",
      user: { email, name, image: picture },
    });

  } catch (error) {
    console.error("\n🔴 GOOGLE AUTH FAILURE");

    // Axios / Google API error
    if (error.response) {
      console.error("📡 Status Code:", error.response.status);
      console.error("📡 Response Data:", error.response.data);

      return res.status(500).json({
        stage: detectFailureStage(error),
        status: error.response.status,
        googleError: error.response.data,
      });
    }

    // Non-Axios error
    console.error("❌ Error Message:", error.message);

    res.status(500).json({
      stage: "unknown",
      error: error.message,
    });
  }
};

function detectFailureStage(error) {
  const msg = JSON.stringify(error.response?.data || "");

  if (msg.includes("invalid_grant")) return "token_exchange";
  if (msg.includes("redirect_uri")) return "redirect_uri_check";
  if (msg.includes("client_id")) return "client_config";
  if (msg.includes("consent")) return "consent_screen";

  return "google_request";
}