const config = require("../lib/openemr");
const { getClientCredentials, getRedirectUri } = require("../lib/oauth-client");

function getFrontendUrl(req) {
  return process.env.FRONTEND_URL || "http://localhost:3001";
}

module.exports = async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const redirectUri = getRedirectUri(req);
  const frontendBase = getFrontendUrl(req);

  if (!code) {
    const frontendUrl = new URL(`${frontendBase}/portal`);
    frontendUrl.searchParams.set("auth", "error");
    frontendUrl.searchParams.set("reason", "no_code");
    return res.redirect(frontendUrl.toString());
  }

  try {
    const { clientId, clientSecret } = await getClientCredentials(req, redirectUri);
    const tokenUrl = `${config.baseUrl}/oauth2/default/token`;
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };

    if (config.clientId && config.clientSecret) {
      headers.Authorization = `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`;
    }

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers,
      body,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.access_token) {
      console.error("OpenEMR token exchange failed", response.status, data);
      const frontendUrl = new URL(`${frontendBase}/portal`);
      frontendUrl.searchParams.set("auth", "error");
      frontendUrl.searchParams.set("reason", "token_exchange_failed");
      return res.redirect(frontendUrl.toString());
    }

    let profile = null;
    try {
      const profileResponse = await fetch(`${config.baseUrl}/oauth2/default/userinfo`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          Accept: "application/json",
        },
      });
      profile = await profileResponse.json().catch(() => null);
    } catch (profileError) {
      console.warn("Unable to load OpenEMR profile claims", profileError);
    }

    req.session.auth = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
    if (data.patient) {
      req.session.patientId = data.patient;
    }
    req.session.profile = profile;

    const redirectUrl = new URL(`${frontendBase}/portal`);
    redirectUrl.searchParams.set("auth", "success");
    redirectUrl.searchParams.set("state", state || "");
    if (profile?.name) redirectUrl.searchParams.set("patient_name", profile.name);
    if (profile?.email) redirectUrl.searchParams.set("patient_email", profile.email);
    if (profile?.preferred_username) redirectUrl.searchParams.set("patient_username", profile.preferred_username);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Callback exchange error", error);
    const frontendUrl = new URL(`${frontendBase}/portal`);
    frontendUrl.searchParams.set("auth", "error");
    frontendUrl.searchParams.set("reason", "callback_failed");
    return res.redirect(frontendUrl.toString());
  }
};