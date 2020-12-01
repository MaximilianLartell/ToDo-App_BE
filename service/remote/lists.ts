import { ListDb, List, ListId } from '../../types';
import ListModel from '../../db/models/list';

const parseResponse = (document: ListDb) => ({
  listId: document.listId,
  listName: document.listName,
  creatorId: document.creatorId,
  users: [...document.users],
  items: [...document.items],
});

export const findManyLists = async (arr: ListId[]): Promise<List[]> => {
  const lists = await ListModel.find({ listId: { $in: arr } });
  return lists.map((el) => parseResponse(el));
};

export const findListById = async (id: ListId): Promise<List> => {
  const document = await ListModel.findOne({ listId: id });
  if (!document) throw new Error('Not found');
  return parseResponse(document);
};

export const addList = async (list: List): Promise<List> => {
  const document = await new ListModel(list).save();
  return parseResponse(document);
};

export const updateList = async (list: List): Promise<List> => {
  const document = await ListModel.findOneAndUpdate(
    { listId: list.listId },
    {
      users: list.users,
      items: list.items,
    },
    { new: true, useFindAndModify: false }
  );
  if (!document) throw new Error('Not found');
  return parseResponse(document);
};
