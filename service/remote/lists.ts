import { ListDb, List, ListId, Message, ErrorMessage } from '../../types';
import { errorMessage } from '../../utils/helpers';
import ListModel from '../../db/models/list';

const parseResponse = (document: ListDb) => ({
  listId: document.listId,
  listName: document.listName,
  creatorId: document.creatorId,
  users: [...document.users],
  items: [...document.items],
});

export const findManyLists = async (arr: ListId[]): Promise<List[]> => {
  const lists = await ListModel.find({ listId: { $in: arr } }).exec();
  return lists.map((el) => parseResponse(el));
};

export const findListById = async (
  id: ListId
): Promise<List | ErrorMessage> => {
  const document = await ListModel.findOne({ listId: id }).exec();
  if (!document) return errorMessage(Message.LIST_NOT_FOUND);
  return parseResponse(document);
};

export const addList = async (list: List): Promise<List> => {
  const document = await new ListModel(list).save();
  return parseResponse(document);
};

export const updateList = async (list: List): Promise<List | ErrorMessage> => {
  const document = await ListModel.findOneAndUpdate(
    { listId: list.listId },
    {
      users: list.users,
      items: list.items,
    },
    { new: true, useFindAndModify: false }
  ).exec();
  if (!document) return errorMessage(Message.LIST_NOT_FOUND);
  return parseResponse(document);
};

export const removeList = async (id: string): Promise<List | ErrorMessage> => {
  const document = await ListModel.findOne({ listId: id }).exec();
  const status = await ListModel.deleteOne({ listId: id }).exec();
  if (!document || status.ok !== 1) return errorMessage(Message.LIST_NOT_FOUND);
  return parseResponse(document);
};
