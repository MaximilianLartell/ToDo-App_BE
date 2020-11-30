import { addUser, userExist } from './remote/users';
import { NewUser, ErrorMessage, User, Message, NewList, List } from '../types';
import { errorMessage, formatNewUser } from '../utils/helpers';

// CONNECT = 'connect',
// DISCONNECT = 'disconnect',
// CREATE_USER = 'create_user', [X]
// SIGN_IN = 'sign_in',
// SIGN_OUT = 'sign_out',
// CREATE_LIST = 'create_list',
// REMOVE_LIST = 'remove_list',
// NEW_ITEM = 'new_item',
// REMOVE_ITEM = 'remove_item',
// MARK_DONE = 'mark_done',

export const createUser = async (
  newUser: NewUser
): Promise<User | ErrorMessage> => {
  try {
    const { userName } = newUser;

    if (await userExist(userName)) throw new Error(Message.NAME_TAKEN);

    const formatedUser = formatNewUser(newUser);
    return await addUser(formatedUser);
  } catch (err) {
    return errorMessage(err.message);
  }
};

export const createList = async (
  newList: NewList
): Promise<List | ErrorMessage> => {
  return 'hallåå';
};

//sign in
// check if password matches userName
// if true retrive
