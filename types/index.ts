import { Document } from 'mongoose';
import { Server, Socket } from 'socket.io';

export type UserId = string;
export type ListId = string;
export type ItemId = string;
type Password = string;
export type UserName = string;
type Online = boolean;
type ListName = string;
export type Description = string;

export interface PasswordObj {
  readonly userId: UserId;
  password: Password;
}

export interface User {
  readonly userId: UserId;
  userName: UserName;
  createdLists: ListId[];
  subscribedLists: ListId[];
  online: Online;
}

export interface List {
  readonly listId: ListId;
  listName: ListName;
  readonly creatorId: UserId;
  users: UserId[];
  items: ItemId[];
}

export interface Item {
  readonly itemId: ItemId;
  readonly creatorId: UserId;
  description: Description;
  listId: ListId;
  done: boolean;
}

export interface PasswordDb extends PasswordObj, Document {}
export interface UserDb extends User, Document {}
export interface ListDb extends List, Document {}
export interface ItemDb extends Item, Document {}

export interface ErrorMessage {
  type: 'Error';
  message?: Message | string;
}

export interface NewUser {
  userName: UserName;
  password: Password;
}
export interface SignIn {
  userName: UserName;
  password: Password;
}
export interface NewList {
  listName: UserName;
  creatorId: Password;
}

export interface NewItem {
  creatorId: UserId;
  listId: ListId;
  description: Description;
}

export enum Message {
  NAME_TAKEN = 'Username taken',
  NOT_FOUND = 'Not found',
  LIST_NOT_FOUND = 'List not found',
  ITEM_NOT_FOUND = 'List not found',
  USER_NOT_FOUND = 'User not found',
  WRONG_PASSWORD = 'Wrong password',
}

export type IOType = Server;
export type SocketType = Socket;

export enum Events {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SIGN_IN = 'sign_in',
  SIGN_OUT = 'sign_out',
  CREATE_LIST = 'create_list',
  JOIN_LIST = 'join_list',
  REMOVE_LIST = 'remove_list',
  NEW_ITEM = 'new_item',
  REMOVE_ITEM = 'remove_item',
  TOGGLE_DONE = 'toggle_done',
  // CREATE_USER = 'create_user',
}
