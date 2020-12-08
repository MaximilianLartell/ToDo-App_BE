import express from 'express';
import './config';
import http from 'http';
import dbSetup from './db';
import { IOType, SocketType, Events, NewList, NewItem } from './types';
import { isList, isItem } from './types/typeGuards';
import {
  createList,
  createItem,
  toggleDone,
  deleteItem,
  deleteList,
} from './service';
import { findUserById } from './service/remote/users';
import IO from 'socket.io';
import router from './router';
import bodyParser from 'body-parser';
import cors from 'cors';
import { findListById } from './service/remote/lists';

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io: IOType = IO(server);

dbSetup.connect();

app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

io.on('connect', (socket: SocketType) => {
  socket.emit('connect');
  socket.on(Events.CREATE_LIST, async (newList: NewList) => {
    try {
      const created = await createList(newList);
      if (isList(created)) {
        const updatedUser = await findUserById(created.creatorId);
        socket.emit(Events.CREATE_LIST, created, updatedUser);
      } else {
        socket.emit('error', created.message);
      }
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on(Events.JOIN_LIST, (listId: string) => {
    socket.join(listId);
    io.to(listId).emit(Events.JOIN_LIST, `Someone joined ${listId}`);
  });

  socket.on(Events.NEW_ITEM, async (newItem: NewItem) => {
    try {
      const created = await createItem(newItem);
      if (isItem(created)) {
        const updatedList = await findListById(created.listId);
        io.to(newItem.listId).emit(Events.NEW_ITEM, created, updatedList);
      } else {
        socket.emit('error', created.message);
      }
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on(Events.TOGGLE_DONE, async (itemId: string) => {
    try {
      const item = await toggleDone(itemId);
      if (isItem(item)) {
        io.to(item.listId).emit(Events.TOGGLE_DONE, item);
      } else {
        socket.emit('error', item.message);
      }
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on(Events.REMOVE_ITEM, async (itemId: string, listId: string) => {
    try {
      const removedItem = await deleteItem(itemId, listId);
      if (isItem(removedItem)) {
        io.to(listId).emit(Events.REMOVE_ITEM, removedItem);
      } else {
        socket.emit('error', removedItem.message);
      }
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on(Events.REMOVE_LIST, async (listId: string) => {
    try {
      const removedList = await deleteList(listId);
      if (isList(removedList)) {
        io.emit(Events.REMOVE_LIST, removedList);
      } else {
        socket.emit('error', removedList.message);
      }
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
