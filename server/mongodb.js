const mongoose = require('mongoose');

// use the native Promise implementation
mongoose.Promise = global.Promise;

function connect(callback) {
  const MONGO_URL = process.env.MONGO_URL || 'test';
  mongoose.connect(MONGO_URL, {
    db: {native_parser: true},
    server: {poolSize: 5},
  });

  mongoose.connection.on('open', () => callback());
  mongoose.connection.on('error', (err) => callback(err));
}

module.exports = {
  connect,
};
