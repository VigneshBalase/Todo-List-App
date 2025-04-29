const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/config');

// Database connection
mongoose.connect(config.mongo.uri).then(() => {
  console.log('Connected to MongoDB');
});

// Start server
const port = config.port || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});