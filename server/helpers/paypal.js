const paypal = require("@paypal/checkout-server-sdk");
// Set up PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  "AeNtl4dhyZmMR7UxV1PqGKSo5cbjC3P1UkqYmILTK_JUBNJptvlkEReqwb12q-3R9tC2n52KyilxiJvb", // client id
  "EMTLLZ5r3-C3eFuYe4SbsINpJYdTFFYYsbA83nQhaqCRfRXmmz2XSokFaTe2czXYicqNIjp21jbsOji5" // secret
);

// PayPal HTTP client instance with environment
const client = new paypal.core.PayPalHttpClient(environment);

// Exporting the client for use in other modules
// module.exports = client;
// Export the PayPal client and SDK
module.exports = {
  paypal,
  client
};
