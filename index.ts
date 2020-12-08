import express from 'express';
import './config';
import http from 'http';
import dbSetup from './db';
import { IOType, SocketType } from './types';
import socketEvents from './utils';
import IO from 'socket.io';
import router from './router';
import bodyParser from 'body-parser';
import cors from 'cors';

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io: IOType = IO(server);

dbSetup.connect();

app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

io.on('connect', (socket: SocketType) => {
  socketEvents(socket, io);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
