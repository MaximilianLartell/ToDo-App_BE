import { describe, beforeAll, afterAll, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  createUser,
  signOut,
  signIn,
  createList,
  validateCredentials,
  createItem,
} from './index';
import UserModel from '../db/models/user';
import ListModel from '../db/models/list';
import ItemModel from '../db/models/item';
import PasswordModel from '../db/models/password';
import {
  ErrorMessage,
  Message,
  User,
  PasswordObj,
  Item,
  ListDb,
} from '../types';
import { isUser, isError, isList, isItem } from '../types/typeGuards';
import { errorMessage } from '../utils/helpers';

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
});

afterAll(async () => {
  await mockDbShutdown();
});

describe('Testing createUser', () => {
  it('isUser should be true', async () => {
    await UserModel.remove({});
    const newUser = { userName: 'user1', password: 'pword' };
    const user = await createUser(newUser);
    expect(isUser(user)).toEqual(true);
  });

  it('one user should exist in users collection in db', async () => {
    const all = await UserModel.find({});
    expect(all.length).toEqual(1);
  });

  it('one item should exist in passwords collection in db', async () => {
    const all = await PasswordModel.find({});
    expect(all.length).toEqual(1);
  });

  it('isUser should be true and returned user should have all properties of User Type', async () => {
    await UserModel.remove({});
    const newUser = { userName: 'user1', password: 'pword' };
    const user = await createUser(newUser);
    expect('userId' in user).toEqual(true);
    expect('userName' in user).toEqual(true);
    expect('createdLists' in user).toEqual(true);
    expect('subscribedLists' in user).toEqual(true);
    expect('online' in user).toEqual(true);
  });

  it('Should add passwordObject to password db', async () => {
    await UserModel.remove({});
    const newUser = { userName: 'user1', password: 'pword' };
    const user = await createUser(newUser);
    const passwordObj = await PasswordModel.findOne({
      userId: (user as User).userId,
    });
    expect((user as User).userId).toEqual((passwordObj as PasswordObj).userId);
  });

  it('Should return an errorMessage if userName is taken', async () => {
    const newUser = { userName: 'user1', password: 'pword' };
    const error = await createUser(newUser);
    expect(isError(error)).toEqual(true);
    expect((error as ErrorMessage).type).toEqual('Error');
    expect((error as ErrorMessage).message).toEqual(Message.NAME_TAKEN);
  });
});

describe('Testing createList', () => {
  it('isList should be true', async () => {
    await UserModel.remove({});
    await ListModel.remove({});
    await new UserModel({
      userId: 'user',
      userName: 'user1',
      createdLists: [],
      subscribedLists: [],
      online: false,
    }).save();
    const newList = { listName: 'list', creatorId: 'user' };
    const list = await createList(newList);
    expect(isList(list)).toEqual(true);
  });
});

describe('Testing validateCredentials', () => {
  it('Validate should be true', async () => {
    await UserModel.remove({});
    await PasswordModel.remove({});
    await new UserModel({
      userId: 'user',
      userName: 'user1',
      createdLists: [],
      subscribedLists: [],
      online: false,
    }).save();
    await new PasswordModel({ userId: 'user', password: 'password' }).save();
    const validate = await validateCredentials({
      userName: 'user1',
      password: 'password',
    });
    expect(validate).toEqual(true);
  });

  it('Validate should be error message - user not found', async () => {
    const validate = await validateCredentials({
      userName: 'null',
      password: 'password',
    });
    const em = errorMessage(Message.USER_NOT_FOUND);
    expect(validate).toEqual(em);
  });

  it('Validate should be error message -  wrong password', async () => {
    const validate = await validateCredentials({
      userName: 'user1',
      password: 'wrong_password',
    });
    const em = errorMessage(Message.WRONG_PASSWORD);
    expect(validate).toEqual(em);
  });
});

describe('Testing createItem', () => {
  it('isItem should be true', async () => {
    await ItemModel.remove({});
    await ListModel.remove({});
    await new ListModel({
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1'],
      items: [],
    }).save();
    const item = await createItem({
      creatorId: 'user1',
      description: 'Todo',
      listId: '123abc',
    });
    expect(isItem(item)).toEqual(true);
  });

  it('expect list to contain new item', async () => {
    await ItemModel.remove({});
    await ListModel.remove({});
    await new ListModel({
      listId: '123abc',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1'],
      items: [],
    }).save();
    const item = await createItem({
      creatorId: 'user1',
      description: 'Todo',
      listId: '123abc',
    });
    const list = await ListModel.findOne({ listId: '123abc' });

    expect((list as ListDb).items.includes((item as Item).itemId)).toBeTruthy();
  });
});

describe('Testing signIn', () => {
  it('setup works', async () => {
    const user1 = {
      userId: '123abc',
      userName: 'user1',
      createdLists: ['list123'],
      subscribedLists: ['list456'],
      online: false,
    };
    const pword1 = {
      userId: '123abc',
      password: 'pword1',
    };
    await UserModel.remove({});
    await PasswordModel.remove({});
    await new UserModel(user1).save();
    await new PasswordModel(pword1).save();
    const user = await UserModel.find({});
    const pword = await PasswordModel.find({});
    expect(user.length).toEqual(1);
    expect(pword.length).toEqual(1);
  });

  it('should return error if username does not exist', async () => {
    const userName = 'bogus';
    const res = await signIn(userName);
    const error = errorMessage(Message.USER_NOT_FOUND);
    expect(res).toEqual(error);
  });
});

describe('Testing signOut', () => {
  it('Should return user with online set to false', async () => {
    await UserModel.remove({});
    await PasswordModel.remove({});
    const user1 = {
      userId: '123abc',
      userName: 'user1',
      createdLists: ['list123'],
      subscribedLists: ['list456'],
      online: true,
    };
    await new UserModel(user1).save();
    const user = await signOut(user1);
    expect((user as User).online).toEqual(false);
  });
});
