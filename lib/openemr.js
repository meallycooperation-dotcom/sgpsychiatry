require("dotenv").config({ path: ".env.local" });

module.exports = {
    baseUrl: process.env.OPENEMR_BASE_URL || process.env.OPENEMR_URL,
    clientId: process.env.OPENEMR_CLIENT_ID,
    clientSecret: process.env.OPENEMR_CLIENT_SECRET,
    redirectUri: process.env.OPENEMR_REDIRECT_URI
};
