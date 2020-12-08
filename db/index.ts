import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@reminderapp.czpki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const server = new MongoMemoryServer();
let database: mongoose.Connection;
const connect = () => {
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
const disconnect = () => {
  if (!database) {
    console.log('db already disconnected');
    return;
  }
  mongoose.disconnect();
};

const devConnect = async () => {
  try {
    const uri = await server.getUri();
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: false,
        useUnifiedTopology: true,
      })
      .then(() => console.log('dev db setup complete'));
  } catch (err) {
    console.log(err);
  }
};

const devDisconnect = async () => {
  await mongoose.disconnect().then(() => console.log('dev db stopped'));
  await server.stop();
};

let dbSetup =
  process.env.NODE_ENV === 'production'
    ? { connect, disconnect }
    : { connect: devConnect, disconnect: devDisconnect };

export default dbSetup;
