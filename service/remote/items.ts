import { ItemDb, Item, Message, ErrorMessage } from '../../types';
import ItemModel from '../../db/models/item';
import { errorMessage } from '../../utils/helpers';

const parseResponse = (document: ItemDb) => ({
  itemId: document.itemId,
  creatorId: document.creatorId,
  description: document.description,
  listId: document.listId,
  done: document.done,
});

export const findManyItems = async (arr: string[]): Promise<Item[]> => {
  const items = await ItemModel.find({ itemId: { $in: arr } }).exec();
  const parsedItems = items.map((el) => parseResponse(el));
  return parsedItems;
};

export const findItemById = async (
  id: string
): Promise<Item | ErrorMessage> => {
  const document = await ItemModel.findOne({ itemId: id }).exec();
  if (!document) return errorMessage(Message.ITEM_NOT_FOUND);
  return parseResponse(document);
};

export const findItemsByListId = async (id: string): Promise<Item[]> => {
  const items = await ItemModel.find({ listId: id }).exec();
  const parsedItems = items.map((el) => parseResponse(el));
  return parsedItems;
};

export const addItem = async (item: Item): Promise<Item> => {
  const newItem = new ItemModel(item);
  const document = await newItem.save();
  return parseResponse(document);
};

export const updateItem = async (item: Item): Promise<Item | ErrorMessage> => {
  const document = await ItemModel.findOneAndUpdate(
    { itemId: item.itemId },
    {
      done: !item.done,
    },
    { new: true, useFindAndModify: false }
  ).exec();
  if (!document) return errorMessage(Message.ITEM_NOT_FOUND);
  return parseResponse(document);
};

export const removeItem = async (id: string): Promise<Item | ErrorMessage> => {
  const document = await ItemModel.findOne({ itemId: id }).exec();
  const status = await ItemModel.deleteOne({ itemId: id }).exec();
  if (!document || status.ok !== 1) return errorMessage(Message.ITEM_NOT_FOUND);
  return parseResponse(document);
};

export const removeManyItems = async (arr: string[]): Promise<void> => {
  await ItemModel.deleteMany({ itemId: { $in: arr } }).exec();
};
