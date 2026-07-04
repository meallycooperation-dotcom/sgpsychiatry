const { parseJson } = require('./lib/response');

async function getDoctors(client) {
  const res = await client.request('/api/doctors');
  return parseJson(res);
}

module.exports = { getDoctors };
