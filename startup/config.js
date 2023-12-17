const config = require("config");

module.exports = function () {
  // Modify config to use environment variables directly on Vercel
  if (process.env.NODE_ENV === "production") {
    config.util.setModuleDefaults("custom-environment-variables", {
      jwtPrivateKey: "VIDLY_JWT_PRIVATE_KEY", // Match Vercel env variable
      // Other variable mappings...
    });
  }

  if (!config.has("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
