import { Document } from 'mongoose';
import socketIO from 'socket.io';

export interface Error {
  code: number;
  error: string;
}

export interface User {
  userId: string;
  userName: string;
  password: string;
  createdLists: string[];
  subscribedLists: string[];
  online: boolean;
}

export interface List {
  listId: string;
  listName: string;
  creatorId: string;
  users: string[];
  items: string[];
}

export interface Item {
  itemId: string;
  creatorId: string;
  description: string;
  listId: string;
  done: boolean;
}

export interface UserDb extends User, Document {}
export interface ListDb extends List, Document {}
export interface ItemDb extends Item, Document {}

export type IO = socketIO.Server;
export type Socket = socketIO.Socket;
