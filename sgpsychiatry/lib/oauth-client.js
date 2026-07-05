const config = require('./openemr');

function getRedirectUri(req) {
  const forwardedProto = req.headers['x-forwarded-proto'] || req.protocol;
  const forwardedHost = req.headers['x-forwarded-host'] || req.get('host');
  const baseUrl = `${forwardedProto}://${forwardedHost}`;
  return process.env.OPENEMR_REDIRECT_URI || `${baseUrl}/api/callback`;
}

async function getClientCredentials(req, redirectUri) {
  const clientId = process.env.OPENEMR_CLIENT_ID || config.clientId;
  const clientSecret = process.env.OPENEMR_CLIENT_SECRET || config.clientSecret;

  if (clientId && clientSecret) {
    return { clientId, clientSecret };
  }

  const registrationUrl = `${config.baseUrl}/oauth2/default/registration`;
  const response = await fetch(registrationUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      application_type: 'private',
      redirect_uris: [redirectUri],
      client_name: 'SGPsychiatry Patient Portal',
      token_endpoint_auth_method: 'client_secret_post',
      scope: 'openid offline_access api:oemr',
      contacts: ['info@sgpsychiatry.com'],
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.client_id || !data?.client_secret) {
    throw new Error(`OpenEMR client registration failed: ${response.status} ${JSON.stringify(data)}`);
  }

  process.env.OPENEMR_CLIENT_ID = data.client_id;
  process.env.OPENEMR_CLIENT_SECRET = data.client_secret;

  return { clientId: data.client_id, clientSecret: data.client_secret };
}

module.exports = {
  getClientCredentials,
  getRedirectUri,
};
