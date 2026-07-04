import { generateKeyPair, exportJWK } from "jose";
import fs from "fs";

const { publicKey } = await generateKeyPair("RS256", {
  extractable: true
});

const jwk = await exportJWK(publicKey);

jwk.use = "sig";
jwk.alg = "RS256";
jwk.kid = "sgpsychiatry-key-1";

fs.writeFileSync(
  "jwks.json",
  JSON.stringify({ keys: [jwk] }, null, 2)
);

console.log("✅ jwks.json generated successfully.");