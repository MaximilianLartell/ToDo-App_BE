import { Document } from 'mongoose';
import socketIO from 'socket.io';

export type UserId = string;
export type ListId = string;
type ItemId = string;
type Password = string;
type UserName = string;
type Online = boolean;
type ListName = string;
type Description = string;
type Done = boolean;

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
  done: Done;
}

export interface PasswordDb extends PasswordObj, Document {}
export interface UserDb extends User, Document {}
export interface ListDb extends List, Document {}
export interface ItemDb extends Item, Document {}

export interface ErrorMessage {
  type: 'Error';
  message: Message | string;
}

export interface NewUser {
  userName: UserName;
  password: Password;
}
export interface SignIn {
  userName: UserName;
  password: Password;
}

export interface SignInRes {
  user: User;
  lists: List[];
}

export enum Message {
  NAME_TAKEN = 'Username taken',
  NOT_FOUND = 'Not found',
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
