import {
  addUser,
  findUserByName,
  toggleOnline,
  findUserById,
  updateUser,
} from './remote/users';
import { addList, findListById, updateList, removeList } from './remote/lists';
import {
  addItem,
  updateItem,
  findItemById,
  removeItem,
  removeManyItems,
} from './remote/items';
import { findPasswordByUserId } from './remote/passwords';
import {
  NewUser,
  ErrorMessage,
  User,
  SignIn,
  UserName,
  Message,
  NewList,
  List,
  NewItem,
  Item,
  ListId,
} from '../types';
import { isError, isUser } from '../types/typeGuards';
import {
  errorMessage,
  formatNewUser,
  formatNewList,
  formatNewItem,
} from '../utils/helpers';
import { addPassword } from './remote/passwords';

// SIGN_OUT = 'sign_out',
// SUBSCRIBE to list

export const createUser = async (
  newUser: NewUser
): Promise<User | ErrorMessage> => {
  const { userName, password } = newUser;
  const userCheck = await findUserByName(userName);
  if (isUser(userCheck)) return errorMessage(Message.NAME_TAKEN);
  const user = formatNewUser(newUser);
  const passwordObj = { userId: user.userId, password };
  await addPassword(passwordObj);
  return await addUser(user);
};

export const createList = async (
  newList: NewList
): Promise<List | ErrorMessage> => {
  const { creatorId } = newList;
  const list = formatNewList(newList);

  const user = await findUserById(creatorId);
  if (isError(user)) return user;
  await updateUser({
    ...user,
    createdLists: [...user.createdLists, list.listId],
  });
  return await addList(list);
};

export const validateCredentials = async ({
  userName,
  password,
}: SignIn): Promise<ErrorMessage | boolean> => {
  const user = await findUserByName(userName);
  if (isError(user)) return user;

  const correctPassword = await findPasswordByUserId(user.userId);
  if (password !== correctPassword.password)
    return errorMessage(Message.WRONG_PASSWORD);

  return true;
};

export const createItem = async (
  newItem: NewItem
): Promise<Item | ErrorMessage> => {
  const { listId } = newItem;
  const item = formatNewItem(newItem);
  const list = await findListById(listId);
  if (isError(list)) return list;
  await updateList({ ...list, items: [...list.items, item.itemId] });
  return await addItem(item);
};

export const toggleDone = async (
  itemId: string
): Promise<Item | ErrorMessage> => {
  const item = await findItemById(itemId);
  if (isError(item)) return item;
  return await updateItem(item);
};

export const deleteItem = async (
  itemId: string,
  listId: string
): Promise<Item | ErrorMessage> => {
  const item = await removeItem(itemId);
  const list = await findListById(listId);
  if (isError(item)) return item;
  if (isError(list)) return list;
  const listItems = list.items.filter((el) => el !== itemId);
  await updateList({ ...list, items: listItems });
  return item;
};

export const signIn = async (
  userName: UserName
): Promise<User | ErrorMessage> => {
  const res = await findUserByName(userName);
  if (isError(res)) return res;
  if (!res.online) return await toggleOnline(res);
  else return res;
};

export const signOut = async (user: User): Promise<User | ErrorMessage> => {
  try {
    return await toggleOnline(user);
  } catch (err) {
    return errorMessage(err.message);
  }
};

export const deleteList = async (
  listId: ListId,
  user: User
): Promise<List | ErrorMessage> => {
  const removedList = await removeList(listId);
  if (isError(removedList)) return removedList;
  await updateUser({
    ...user,
    createdLists: user.createdLists.filter((li) => li !== listId),
  });
  await removeManyItems(removedList.items);
  return removedList;
};
