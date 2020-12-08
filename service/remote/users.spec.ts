import { describe, beforeAll, afterAll, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../../db/models/user';
import {
  findUserById,
  userExist,
  addUser,
  findManyUsers,
  updateUser,
  findAllUsers,
} from './users';

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
  const user1 = new UserModel({
    userId: '123abc',
    userName: 'user1',
    createdLists: [],
    subscribedLists: [],
    online: false,
  });
  const user2 = new UserModel({
    userId: '456def',
    userName: 'user2',
    createdLists: [],
    subscribedLists: [],
    online: false,
  });
  await user1.save();
  await user2.save();
});

afterAll(async () => {
  await mockDbShutdown();
});

describe('Testing setup', () => {
  it('Initial db should contain 2 elements', async () => {
    const all = await UserModel.find({});
    expect(all.length).toEqual(2);
  });
});

describe('Testing findManyUsers and findAllUsers', () => {
  it('should return both users', async () => {
    const expected1 = {
      userId: '123abc',
      userName: 'user1',
      createdLists: [],
      subscribedLists: [],
      online: false,
    };
    const expected2 = {
      userId: '456def',
      userName: 'user2',
      createdLists: [],
      subscribedLists: [],
      online: false,
    };
    const many = await findManyUsers(['123abc', '456def']);
    expect(many).toEqual([expected1, expected2]);
  });

  it('should return both users', async () => {
    const expected1 = {
      userId: '123abc',
      userName: 'user1',
      createdLists: [],
      subscribedLists: [],
      online: false,
    };
    const expected2 = {
      userId: '456def',
      userName: 'user2',
      createdLists: [],
      subscribedLists: [],
      online: false,
    };
    const many = await findAllUsers();
    expect(many).toEqual([expected1, expected2]);
  });
});

describe('Testing findUserById', () => {
  it('Should find user based on userId', async () => {
    const expected = {
      userId: '123abc',
      userName: 'user1',
      createdLists: [],
      subscribedLists: [],
      online: false,
    };
    const user = await findUserById('123abc');
    expect(user).toEqual(expected);
  });
});

describe('Testing userExist', () => {
  it('Should return true', async () => {
    const user = await userExist('user1');
    expect(user).toBe(true);
  });

  it('Should return false', async () => {
    const user = await userExist('unknown');
    expect(user).toBe(false);
  });
});

describe('Testing addUser', () => {
  it('Should be null before new user is added', async () => {
    await UserModel.remove({});
    const user = await UserModel.findOne({ userId: '789ghi' });
    expect(user).toBeNull();
  });

  it('Should not be null if new user is added', async () => {
    await UserModel.remove({});
    const newUser = {
      userId: '789ghi',
      userName: 'user3',
      createdLists: [],
      subscribedLists: [],
      online: false,
    };
    await addUser(newUser);
    const user = await UserModel.findOne({ userId: '789ghi' });
    expect(user).not.toBeNull();
  });

  it('Function should return created document on success', async () => {
    await UserModel.remove({});
    const newUser = {
      userId: '789ghi',
      userName: 'user3',
      createdLists: [],
      subscribedLists: [],
      online: false,
    };
    const addedUser = await addUser(newUser);
    expect(addedUser).toEqual(newUser);
  });
});

describe('Testing updateUser', () => {
  it('Function should update the createdLists array', async () => {
    await UserModel.remove({});
    const user = new UserModel({
      userId: '123abc',
      userName: 'user1',
      createdLists: [],
      subscribedLists: [],
      online: false,
    });
    await user.save();
    const updatedUser = {
      userId: '123abc',
      userName: 'user1',
      createdLists: ['mylist1'],
      subscribedLists: [],
      online: false,
    };
    const uppdated = await updateUser(updatedUser);
    expect(uppdated).toEqual(updatedUser);
  });

  it('Function should update createdLists, subscribedLists and online property', async () => {
    await UserModel.remove({});
    const user = new UserModel({
      userId: '123abc',
      userName: 'user1',
      createdLists: [],
      subscribedLists: [],
      online: false,
    });
    await user.save();
    const updatedUser = {
      userId: '123abc',
      userName: 'user1',
      createdLists: ['mylist1'],
      subscribedLists: ['mylist1'],
      online: false,
    };
    const uppdated = await updateUser(updatedUser);
    expect(uppdated).toEqual(updatedUser);
  });
});
