import express from 'express';
import './config';
import http from 'http';
import { connect } from './db';
import { IO, Socket } from './types';

const app = express();
// is this step necessary?
app.set('port', process.env.PORT || 8000);

const server = new http.Server(app);

const io: IO = require('socket.io').listen(server);

// Connection should have some sort of await functionality
connect();

io.on('connection', (socket: Socket) => {
  console.log(socket.id);
});

server.listen(8000, () => {
  console.log('listening to port 8000');
});
