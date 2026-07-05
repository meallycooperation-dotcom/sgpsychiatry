const OpenEMR = require('./openemr');

async function login(client /* instance of OpenEMR */, username, password) {
  const res = await client.request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json().catch(() => null);
  if (json && json.token) client.setToken(json.token);
  return json;
}

module.exports = { login };
