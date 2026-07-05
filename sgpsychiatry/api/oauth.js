const crypto = require("crypto");
const config = require("../lib/openemr");
const { getClientCredentials, getRedirectUri } = require("../lib/oauth-client");

module.exports = async (req, res) => {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    const redirectUri = getRedirectUri(req);
    const { clientId } = await getClientCredentials(req, redirectUri);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "openid offline_access api:oemr",
      state,
      aud: `${config.baseUrl}/apis/default/fhir`,
    });

    const authUrl = `${config.baseUrl}/oauth2/default/authorize?${params.toString()}`;

    console.log("OAuth authorize URL:", authUrl);
    console.log("Using redirect URI:", redirectUri);

    res.redirect(authUrl);
  } catch (error) {
    console.error("OAuth initiation failed", error);
    res.status(500).json({ success: false, error: error.message });
  }
};