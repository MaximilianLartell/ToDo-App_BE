import { describe, beforeAll, afterAll, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import PasswordModel from '../../db/models/password';
import { addPassword, findPasswordByUserId } from './passwords';

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
  const pword1 = new PasswordModel({
    userId: '123abc',
    password: 'pword1',
  });
  const pword2 = new PasswordModel({
    userId: '456def',
    password: 'pword2',
  });
  await pword1.save();
  await pword2.save();
});

afterAll(async () => {
  await mockDbShutdown();
});

describe('Testing setup', () => {
  describe('Testing findPasswordByUserId', () => {
    it('Should find password based on userId', async () => {
      const expected = {
        userId: '123abc',
        password: 'pword1',
      };
      const user = await findPasswordByUserId('123abc');
      expect(user).toEqual(expected);
    });
  });

  describe('Testing addUser', () => {
    it('Should not be null if new user is added', async () => {
      await PasswordModel.remove({});
      const newUser = {
        userId: '789ghi',
        password: 'pword3',
      };
      await addPassword(newUser);
      const user = await PasswordModel.findOne({ userId: '789ghi' });
      expect(user).not.toBeNull();
    });

    it('Function should return created document on success', async () => {
      await PasswordModel.remove({});
      const newUser = {
        userId: '789ghi',
        password: 'pword3',
      };
      const addedUser = await addPassword(newUser);
      expect(addedUser).toEqual(newUser);
    });
  });
});
