import { describe, beforeAll, afterAll, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ItemModel from '../../db/models/item';
import {
  findManyItems,
  findItemById,
  findItemsByListId,
  addItem,
  updateItem,
  removeItem,
} from './items';

// eslint-disable-next-line no-undef
jest.setTimeout(60000);

const server = new MongoMemoryServer();

const mockDbSetup = async () => {
  try {
    const uri = await server.getUri();
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: false,
        useUnifiedTopology: true,
      })
      .then(() => console.log('mockserver setup complete'));
  } catch (err) {
    console.log(err);
  }
};

const mockDbShutdown = async () => {
  await mongoose.disconnect().then(() => console.log('server stopped'));
  await server.stop();
};

beforeAll(async () => {
  await mockDbSetup();
  const item1 = new ItemModel({
    itemId: '123abc',
    creatorId: 'user1',
    description: 'Todo',
    listId: 'list1',
    done: false,
  });
  const item2 = new ItemModel({
    itemId: '456def',
    creatorId: 'user2',
    description: 'Todo',
    listId: 'list2',
    done: false,
  });
  const item3 = new ItemModel({
    itemId: '789ghi',
    creatorId: 'user2',
    description: 'Todo',
    listId: 'list1',
    done: false,
  });
  await item1.save();
  await item2.save();
  await item3.save();
});

afterAll(async () => {
  await mockDbShutdown();
});

describe('Testing setup', () => {
  it('Initial db should contain 2 elements', async () => {
    const all = await ItemModel.find({});
    expect(all.length).toEqual(3);
  });
});

describe('Testing findManyItems', () => {
  it('find many should return both items', async () => {
    const expected1 = {
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    const expected2 = {
      itemId: '456def',
      creatorId: 'user2',
      description: 'Todo',
      listId: 'list2',
      done: false,
    };
    const many = await findManyItems(['123abc', '456def']);
    expect(many).toEqual([expected1, expected2]);
  });
});

describe('Testing findItemById', () => {
  it('Should find list based on itemId', async () => {
    const expected = {
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    const list = await findItemById('123abc');
    expect(list).toEqual(expected);
  });
});

describe('Testing findItemsByListId', () => {
  it('Should find items based on listId', async () => {
    const expected1 = {
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    const expected2 = {
      itemId: '789ghi',
      creatorId: 'user2',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    const list = await findItemsByListId('list1');
    expect(list).toEqual([expected1, expected2]);
  });
});

describe('Testing addItem', () => {
  it('Should not be null if new item is added', async () => {
    await ItemModel.remove({});
    const newItem = {
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    await addItem(newItem);
    const user = await ItemModel.findOne({ itemId: '123abc' });
    expect(user).not.toBeNull();
  });

  it('Function should return created document on success', async () => {
    await ItemModel.remove({});
    const newItem = {
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    const addedList = await addItem(newItem);
    expect(addedList).toEqual(newItem);
  });
});

describe('Testing updateItem', () => {
  it('Function should update the done property', async () => {
    await ItemModel.remove({});
    const item = {
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    await new ItemModel(item).save();
    const expected = {
      ...item,
      done: true,
    };
    const uppdated = await updateItem(item);
    expect(uppdated).toEqual(expected);
  });
});

describe('Testing removeItem', () => {
  it('Only one item should remain in collection', async () => {
    await ItemModel.remove({});
    const item1 = new ItemModel({
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    });
    const item2 = new ItemModel({
      itemId: '456def',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list2',
      done: false,
    });
    await item1.save();
    await item2.save();
    await removeItem('123abc');
    const items = await ItemModel.find({});
    expect(items.length).toEqual(1);
  });

  it('Should return removed item', async () => {
    await ItemModel.remove({});
    const item1 = {
      itemId: '123abc',
      creatorId: 'user1',
      description: 'Todo',
      listId: 'list1',
      done: false,
    };
    const item = new ItemModel(item1);
    await item.save();
    const removedItem = await removeItem('123abc');
    expect(removedItem).toEqual(item1);
  });
});
