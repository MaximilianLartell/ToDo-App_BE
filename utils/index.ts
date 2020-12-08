import {
  createList,
  createItem,
  toggleDone,
  deleteItem,
  deleteList,
} from '../service';
import { findUserById } from '../service/remote/users';
import {
  IOType,
  SocketType,
  NewList,
  NewItem,
  ListId,
  ItemId,
  Events,
  User,
} from '../types';
import { isList, isItem } from '../types/typeGuards';
import { findListById } from '../service/remote/lists';

const socketEvents = (socket: SocketType, io: IOType) => {
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

  socket.on(Events.JOIN_LIST, (listId: ListId) => {
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

  socket.on(Events.TOGGLE_DONE, async (itemId: ItemId) => {
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

  socket.on(Events.REMOVE_ITEM, async (itemId: ItemId, listId: ListId) => {
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

  socket.on(Events.REMOVE_LIST, async (listId: ListId, user: User) => {
    try {
      const removedList = await deleteList(listId, user);
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
};

export default socketEvents;
