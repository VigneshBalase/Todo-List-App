require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongo: {
    uri: process.env.MONGO_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE
  }
};