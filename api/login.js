const { login } = require('./lib/auth');

async function performLogin(client, username, password) {
  return login(client, username, password);
}

module.exports = { performLogin };
