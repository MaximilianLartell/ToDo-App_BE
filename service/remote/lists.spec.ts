import { describe, beforeAll, afterAll, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ListModel from '../../db/models/list';
import { findManyLists, findListById, addList, updateList } from './lists';

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
  const list1 = new ListModel({
    listId: '123abc',
    listName: 'list1',
    creatorId: 'user1',
    users: ['user1'],
    items: [],
  });
  const list2 = new ListModel({
    listId: '456def',
    listName: 'list2',
    creatorId: 'user2',
    users: ['user2', 'user1'],
    items: ['item1'],
  });
  await list1.save();
  await list2.save();
});

afterAll(async () => {
  await mockDbShutdown();
});

describe('Testing setup', () => {
  it('Initial db should contain 2 elements', async () => {
    const all = await ListModel.find({});
    expect(all.length).toEqual(2);
  });
});

describe('Testing findManyLists', () => {
  it('find many should return both users', async () => {
    const expected1 = {
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1'],
      items: [],
    };
    const expected2 = {
      listId: '456def',
      listName: 'list2',
      creatorId: 'user2',
      users: ['user2', 'user1'],
      items: ['item1'],
    };
    const many = await findManyLists(['123abc', '456def']);
    expect(many).toEqual([expected1, expected2]);
  });
});

describe('Testing findListById', () => {
  it('Should find list based on listId', async () => {
    const expected = {
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1'],
      items: [],
    };
    const list = await findListById('123abc');
    expect(list).toEqual(expected);
  });
});

describe('Testing addList', () => {
  it('Should be null before new list is added', async () => {
    await ListModel.remove({});
    const list = await ListModel.findOne({ listId: '789ghi' });
    expect(list).toBeNull();
  });

  it('Should not be null if new list is added', async () => {
    await ListModel.remove({});
    const newList = {
      listId: '789ghi',
      listName: 'list3',
      creatorId: 'user3',
      users: ['user3', 'user1'],
      items: ['item1'],
    };
    await addList(newList);
    const list = await ListModel.findOne({ listId: '789ghi' });
    expect(list).not.toBeNull();
  });

  it('Function should return created document on success', async () => {
    await ListModel.remove({});
    const newList = {
      listId: '789ghi',
      listName: 'list3',
      creatorId: 'user3',
      users: ['user3', 'user1'],
      items: ['item1'],
    };
    const addedList = await addList(newList);
    expect(addedList).toEqual(newList);
  });
});

describe('Testing updateList', () => {
  it('Function should update the users array', async () => {
    await ListModel.remove({});
    const list = new ListModel({
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1'],
      items: [],
    });
    await list.save();
    const updatedList = {
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1', 'user2'],
      items: [],
    };
    const uppdated = await updateList(updatedList);
    expect(uppdated).toEqual(updatedList);
  });

  it('Function should update users, and and online property', async () => {
    await ListModel.remove({});
    const list = new ListModel({
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1'],
      items: [],
    });
    await list.save();
    const updatedList = {
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1', 'user2'],
      items: ['item1'],
    };
    const uppdated = await updateList(updatedList);
    expect(uppdated).toEqual(updatedList);
  });
});
