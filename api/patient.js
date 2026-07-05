const { parseJson } = require('../lib/response');

async function getPatient(client, patientId) {
  const res = await client.request(`/api/patients/${patientId}`);
  return parseJson(res);
}

async function createPatient(client, payload) {
  const res = await client.request('/api/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

module.exports = { getPatient, createPatient };
