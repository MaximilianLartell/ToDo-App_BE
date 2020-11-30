import * as dotenv from 'dotenv';

dotenv.config();

export const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@reminderapp.czpki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

export enum IncomingEvents {
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
