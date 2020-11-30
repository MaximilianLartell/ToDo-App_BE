import { UserDb, User } from '../../types';
import UserModel from '../../db/models/user';

const parseResponse = (document: UserDb) => ({
  userId: document.userId,
  userName: document.userName,
  password: document.password,
  createdLists: [...document.createdLists],
  subscribedLists: [...document.subscribedLists],
  online: document.online,
});

export const findAllUsers = async (): Promise<User[]> => {
  const users = await UserModel.find({});
  return users.map((el) => parseResponse(el));
};

export const findUserById = async (id: string): Promise<User> => {
  const document = await UserModel.findOne({ userId: id });
  if (!document) throw new Error('Not found');
  return parseResponse(document);
};

export const findManyUsers = async (arr: string[]): Promise<User[]> => {
  const users = await UserModel.find({ userId: { $in: arr } });
  if (users.length === 0) throw new Error('Not found');
  return users.map((el) => parseResponse(el));
};

export const findUserByName = async (name: string): Promise<User> => {
  const document = await UserModel.findOne({ userName: name });
  if (!document) throw new Error('Not found');
  return parseResponse(document);
};

export const addUser = async (user: User): Promise<User> => {
  const document = await new UserModel(user).save();
  return parseResponse(document);
};

export const updateUser = async (user: User): Promise<User> => {
  const document = await UserModel.findOneAndUpdate(
    { userId: user.userId },
    {
      createdLists: user.createdLists,
      subscribedLists: user.subscribedLists,
      online: user.online,
    },
    { new: true, useFindAndModify: false }
  );
  if (!document) throw new Error('Not found');
  return parseResponse(document);
};
