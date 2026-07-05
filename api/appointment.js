const OpenEMR = require('../lib/openemr');
const { parseJson } = require('../lib/response');

async function getAppointments(client) {
  const res = await client.request('/api/appointments');
  return parseJson(res);
}

async function createAppointment(client, payload) {
  const res = await client.request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

module.exports = { getAppointments, createAppointment };
