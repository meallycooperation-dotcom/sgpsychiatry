async function parseJson(response) {
  const ok = response && response.ok;
  const body = await response.json().catch(() => null);
  if (!ok) {
    const err = new Error((body && body.message) || 'Request failed');
    err.status = response && response.status;
    err.body = body;
    throw err;
  }
  return body;
}

module.exports = { parseJson };
