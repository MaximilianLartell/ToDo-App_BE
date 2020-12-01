import { PasswordObj, Message, PasswordDb, UserId } from '../../types';
import PasswordModel from '../../db/models/password';

const parseResponse = (document: PasswordDb) => ({
  userId: document.userId,
  password: document.password,
});

export const findPasswordByUserId = async (
  id: UserId
): Promise<PasswordObj> => {
  const document = await PasswordModel.findOne({ userId: id });
  if (!document) throw new Error(Message.NOT_FOUND);
  return parseResponse(document);
};

export const addPassword = async (
  password: PasswordObj
): Promise<PasswordObj> => {
  const document = await new PasswordModel(password).save();
  return parseResponse(document);
};
