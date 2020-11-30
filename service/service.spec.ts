import { describe, beforeAll, afterAll, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser } from './index';
import UserModel from '../db/models/user';
import { ErrorMessage, Message } from '../types';
import { isUser, isError } from '../types/typeGuards';
// import { errorMessage } from '../utils/helpers';
// import { Message } from '../types';

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
    const newUser = { userName: 'user1', password: 'pword' };
    const user = await createUser(newUser);
    expect(isUser(user)).toEqual(true);
  });

  it('one user should exist in db', async () => {
    const all = await UserModel.find({});
    expect(all.length).toEqual(1);
  });
  it('isUser should be true and returned user should have all properties of User Type', async () => {
    await UserModel.remove({});
    const newUser = { userName: 'user1', password: 'pword' };
    const user = await createUser(newUser);
    expect('userId' in user).toEqual(true);
    expect('userName' in user).toEqual(true);
    expect('password' in user).toEqual(true);
    expect('createdLists' in user).toEqual(true);
    expect('subscribedLists' in user).toEqual(true);
    expect('online' in user).toEqual(true);
  });

  it('Should return an errorMessage if userName is taken', async () => {
    const newUser = { userName: 'user1', password: 'pword' };
    const error = await createUser(newUser);
    expect(isError(error)).toEqual(true);
    expect((error as ErrorMessage).type).toEqual('Error');
    expect((error as ErrorMessage).message).toEqual(Message.NAME_TAKEN);
  });
});
