const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'test';

function connect(callback) {
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
