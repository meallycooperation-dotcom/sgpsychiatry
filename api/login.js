const config = require('../lib/openemr');

async function performLogin(req, res) {
  const { username, password } = req.body || {};

  // If no credentials provided, instruct frontend to start the normal OAuth redirect flow
  if (!username || !password) {
    return res.status(200).json({ success: false, redirect: '/api/oauth', reason: 'no_credentials' });
  }

  // Only attempt resource-owner password grant if enabled via env var
  const allowPasswordGrant = process.env.OPENEMR_ALLOW_PASSWORD_GRANT === 'true';
  if (!allowPasswordGrant) {
    return res.status(200).json({ success: false, redirect: '/api/oauth', reason: 'password_grant_disabled' });
  }

  try {
    const tokenUrl = `${config.baseUrl}/oauth2/default/token`;
    const body = new URLSearchParams({
      grant_type: 'password',
      username,
      password,
      scope: 'openid offline_access api:oemr',
      client_id: process.env.OPENEMR_CLIENT_ID || config.clientId || '',
    });

    if (process.env.OPENEMR_CLIENT_SECRET || config.clientSecret) {
      body.append('client_secret', process.env.OPENEMR_CLIENT_SECRET || config.clientSecret);
    }

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' };

    const response = await fetch(tokenUrl, { method: 'POST', headers, body });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.access_token) {
      console.warn('Password grant failed', response.status, data);
      return res.status(401).json({ success: false, error: 'invalid_credentials', detail: data });
    }

    // Optionally fetch profile
    let profile = null;
    try {
      const profileResp = await fetch(`${config.baseUrl}/oauth2/default/userinfo`, {
        headers: { Authorization: `Bearer ${data.access_token}`, Accept: 'application/json' },
      });
      profile = await profileResp.json().catch(() => null);
    } catch (err) {
      console.warn('Failed to fetch userinfo', err);
    }

    // Establish a simple server-side session
    req.session.auth = { access_token: data.access_token, refresh_token: data.refresh_token };
    req.session.profile = profile;

    return res.status(200).json({ success: true, profile: profile || null });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { performLogin };
