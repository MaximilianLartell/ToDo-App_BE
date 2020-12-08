import {
  ErrorMessage,
  Message,
  NewUser,
  User,
  List,
  NewList,
  NewItem,
  Item,
} from '../types';

export const errorMessage = (message: Message): ErrorMessage => ({
  type: 'Error',
  message,
});

export const formatNewUser = (newUser: NewUser): User => {
  const { userName } = newUser;
  return {
    userId: createId(),
    userName: userName,
    createdLists: [],
    subscribedLists: [],
    online: true,
  };
};

export const formatNewList = (newList: NewList): List => {
  const { creatorId, listName } = newList;
  return {
    listId: createId(),
    listName,
    creatorId: creatorId,
    users: [creatorId],
    items: [],
  };
};

export const formatNewItem = ({
  creatorId,
  listId,
  description,
}: NewItem): Item => {
  return {
    itemId: createId(),
    creatorId: creatorId,
    description: description,
    listId: listId,
    done: false,
  };
};

const createId = (): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let autoId = '';

  for (let i = 0; i < 15; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
};

export const reqIdParser = (str: string): string[] => {
  return str.split(',');
};
