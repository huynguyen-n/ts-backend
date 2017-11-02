import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;
let db = null;

if (mongoose.connection.readyState === 1) {
  db = mongoose.connection;
} else {
  db = mongoose.createConnection(process.env.MONGODB_URI);
}

mongoose.connection.on('connected', () => {
  console.log(`MongoDB connected successfully: ${process.env.MONGODB_URI}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default db;
