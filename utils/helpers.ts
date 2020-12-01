import { ErrorMessage, Message, NewUser, User } from '../types';

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
    online: false,
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
// make a hashing function for pword
