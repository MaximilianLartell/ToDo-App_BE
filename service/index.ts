import { addUser, userExist, findUserByName, updateUser } from './remote/users';
import { findPasswordByUserId } from './remote/passwords';
import { findManyLists } from './remote/lists';
import {
  NewUser,
  ErrorMessage,
  User,
  Message,
  SignIn,
  SignInRes,
} from '../types';
import { errorMessage, formatNewUser } from '../utils/helpers';
import { addPassword } from './remote/passwords';

// CONNECT = 'connect',
// DISCONNECT = 'disconnect',
// CREATE_USER = 'create_user', [X]
// SIGN_IN = 'sign_in', [X]
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
    const { userName, password } = newUser;

    if (await userExist(userName)) throw new Error(Message.NAME_TAKEN);

    const formatedUser = formatNewUser(newUser);
    const passwordObj = { userId: formatedUser.userId, password };
    const user = await addUser(formatedUser);
    await addPassword(passwordObj);
    return user;
  } catch (err) {
    return errorMessage(err.message);
  }
};

// export const createList = async (
//   newList: NewList
// ): Promise<List | ErrorMessage> => {
//   return 'hallåå';
// };

const verifyPassword = async (signIn: SignIn): Promise<User> => {
  const { userName, password } = signIn;
  const user = await findUserByName(userName);
  const correctPassword = await findPasswordByUserId(user.userId);
  if (password !== correctPassword.password)
    throw new Error(Message.WRONG_PASSWORD);
  return user;
};

export const signIn = async (
  signIn: SignIn
): Promise<SignInRes | ErrorMessage> => {
  try {
    const verifiedUser = await verifyPassword(signIn);
    const user = await updateUser({ ...verifiedUser, online: true });
    const lists = await findManyLists([
      ...user.createdLists,
      ...user.subscribedLists,
    ]);
    return {
      user,
      lists,
    };
  } catch (err) {
    return errorMessage(err.message);
  }
};

export const signOut = async (user: User): Promise<User | ErrorMessage> => {
  try {
    return await updateUser({ ...user, online: false });
  } catch (err) {
    return errorMessage(err.message);
  }
};
