import mongoose from 'mongoose';
import { DB_URI } from '../config';

let database: mongoose.Connection;
export const connect = () => {
  if (database) {
    console.log('db already connected');
    return;
  }
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  database = mongoose.connection;
  database.once('open', async () => {
    console.log('Connected to database');
  });
  database.on('error', () => {
    console.log('Error connecting to database');
  });
};
export const disconnect = () => {
  if (!database) {
    console.log('db already disconnected');
    return;
  }
  mongoose.disconnect();
};
