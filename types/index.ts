import { Document } from 'mongoose';
import socketIO from 'socket.io';

export interface User {
  readonly userId: string;
  userName: string;
  password: string;
  createdLists: string[];
  subscribedLists: string[];
  online: boolean;
}

export interface List {
  readonly listId: string;
  listName: string;
  readonly creatorId: string;
  users: string[];
  items: string[];
}

export interface Item {
  readonly itemId: string;
  readonly creatorId: string;
  description: string;
  listId: string;
  done: boolean;
}

export interface UserDb extends User, Document {}
export interface ListDb extends List, Document {}
export interface ItemDb extends Item, Document {}

export interface ErrorMessage {
  type: 'Error';
  message: Message | string;
}

export type NewList = Pick<List, 'listName' | 'creatorId' | 'users'>;

export type NewUser = Pick<User, 'userName' | 'password'>;
export type SignIn = NewUser;

export enum Message {
  NAME_TAKEN = 'Username taken',
  LIST_NOT_FOUND = 'List not found',
  USER_NOT_FOUND = 'User not found',
  WRONG_PASSWORD = 'Wrong password',
}

export type IO = socketIO.Server;
export type Socket = socketIO.Socket;

export enum Events {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CREATE_USER = 'create_user',
  SIGN_IN = 'sign_in',
  SIGN_OUT = 'sign_out',
  CREATE_LIST = 'create_list',
  REMOVE_LIST = 'remove_list',
  NEW_ITEM = 'new_item',
  REMOVE_ITEM = 'remove_item',
  MARK_DONE = 'mark_done',
}
