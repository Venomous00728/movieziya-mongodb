module.exports = {
  jwtPrivateKey: process.env.VIDLY_JWT_PRIVATE_KEY || "defaultKey",
  db: process.env.DB_URL || "mongodb://localhost:27017/yourdb",
  port: process.env.PORT || 3900,
  requiresAuth: process.env.REQUIRES_AUTH || true,
};
