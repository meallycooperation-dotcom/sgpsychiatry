const config = require('./openemr');
const { parseJson } = require('./response');

function getAccessToken(req) {
  const token = req.session?.auth?.access_token;
  if (!token) {
    const err = new Error('Unauthenticated request');
    err.status = 401;
    throw err;
  }
  return token;
}

function buildOpenEmrUrl(path) {
  const base = String(config.baseUrl || '').replace(/\/+$/, '');
  if (!base) {
    throw new Error('OpenEMR base URL is not configured');
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${base}${path}`;
  }

  return `${base}/${path}`;
}

function getPatientId(req) {
  return req.session?.patientId || req.session?.profile?.patient || req.session?.profile?.patient_id || null;
}

async function openEmrFetch(req, path, options = {}) {
  const accessToken = getAccessToken(req);
  const url = buildOpenEmrUrl(path);
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

async function openEmrJson(req, path, options = {}) {
  const response = await openEmrFetch(req, path, options);
  return parseJson(response);
}

module.exports = {
  getPatientId,
  openEmrFetch,
  openEmrJson,
};
