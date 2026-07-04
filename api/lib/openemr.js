class OpenEMR {
  constructor({ baseUrl = '', token = null } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
  }

  setToken(token) {
    this.token = token;
  }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    if (typeof fetch === 'undefined') {
      throw new Error('Global `fetch` is not available in this environment.');
    }

    const res = await fetch(url, Object.assign({}, options, { headers }));
    return res;
  }
}

module.exports = OpenEMR;
