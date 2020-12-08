import {
  UserDb,
  User,
  Message,
  UserId,
  UserName,
  ErrorMessage,
} from '../../types';
import UserModel from '../../db/models/user';
import { errorMessage } from '../../utils/helpers';

const parseResponse = (document: UserDb) => ({
  userId: document.userId,
  userName: document.userName,
  createdLists: [...document.createdLists],
  subscribedLists: [...document.subscribedLists],
  online: document.online,
});

export const findAllUsers = async (): Promise<User[]> => {
  const users = await UserModel.find({});
  return users.map((el) => parseResponse(el));
};

export const findUserById = async (
  id: UserId
): Promise<User | ErrorMessage> => {
  const document = await UserModel.findOne({ userId: id });
  if (!document) return errorMessage(Message.USER_NOT_FOUND);
  return parseResponse(document);
};

export const findManyUsers = async (
  arr: UserId[]
): Promise<User[] | ErrorMessage> => {
  const users = await UserModel.find({ userId: { $in: arr } });
  if (users.length === 0) errorMessage(Message.USER_NOT_FOUND);
  return users.map((el) => parseResponse(el));
};

export const findUserByName = async (
  name: UserName
): Promise<User | ErrorMessage> => {
  const document = await UserModel.findOne({ userName: name });
  if (!document) return errorMessage(Message.USER_NOT_FOUND);
  return parseResponse(document);
};

export const userExist = async (name: UserName): Promise<boolean> => {
  const document = await UserModel.findOne({ userName: name });
  if (!document) return false;
  return true;
};

export const addUser = async (user: User): Promise<User> => {
  const document = await new UserModel(user).save();
  return parseResponse(document);
};

export const updateUser = async (user: User): Promise<User | ErrorMessage> => {
  const document = await UserModel.findOneAndUpdate(
    { userId: user.userId },
    {
      createdLists: user.createdLists,
      subscribedLists: user.subscribedLists,
    },
    { new: true, useFindAndModify: false }
  );
  if (!document) return errorMessage(Message.USER_NOT_FOUND);
  return parseResponse(document);
};

export const toggleOnline = async (
  user: User
): Promise<User | ErrorMessage> => {
  const document = await UserModel.findOneAndUpdate(
    { userId: user.userId },
    {
      online: !user.online,
    },
    { new: true, useFindAndModify: false }
  );
  if (!document) return errorMessage(Message.USER_NOT_FOUND);
  return parseResponse(document);
};
