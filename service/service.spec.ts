import { describe, beforeAll, afterAll, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser, signIn, signOut } from './index';
import UserModel from '../db/models/user';
import PasswordModel from '../db/models/password';
import ListModel from '../db/models/list';
import { ErrorMessage, Message, User, PasswordObj, SignInRes } from '../types';
import { isUser, isError, isSignInRes } from '../types/typeGuards';
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
    const list1 = {
      listId: 'list123',
      listName: 'list1',
      creatorId: 'user1',
      users: ['user1'],
      items: [],
    };
    const list2 = {
      listId: 'list456',
      listName: 'list2',
      creatorId: 'user2',
      users: ['user2', 'user1'],
      items: ['item1'],
    };
    await UserModel.remove({});
    await PasswordModel.remove({});
    await new UserModel(user1).save();
    await new PasswordModel(pword1).save();
    await new ListModel(list1).save();
    await new ListModel(list2).save();
    const user = await UserModel.find({});
    const pword = await PasswordModel.find({});
    const lists = await ListModel.find({});
    expect(user.length).toEqual(1);
    expect(pword.length).toEqual(1);
    expect(lists.length).toEqual(2);
  });

  it('should return error if username does not exist', async () => {
    const credentials = { userName: 'bogus', password: 'pword' };
    const signInRes = await signIn(credentials);
    const error = errorMessage(Message.USER_NOT_FOUND);
    expect(signInRes).toEqual(error);
  });
  it('should return error if password does not match userName', async () => {
    const credentials = { userName: 'user1', password: 'pword' };
    const signInRes = await signIn(credentials);
    const error = errorMessage(Message.WRONG_PASSWORD);
    expect(signInRes).toEqual(error);
  });
  it('should return signIn response object if correct', async () => {
    const credentials = { userName: 'user1', password: 'pword1' };
    const signInRes = await signIn(credentials);
    expect(isSignInRes(signInRes)).toEqual(true);
  });
  it('Length of lists should be 2', async () => {
    const credentials = { userName: 'user1', password: 'pword1' };
    const signInRes = await signIn(credentials);
    expect((signInRes as SignInRes).lists.length).toEqual(2);
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
    console.log(user);
    expect((user as User).online).toEqual(false);
  });
});
