import { describe, expect, it } from '@jest/globals';
import { isUser, isItem, isList, isError } from './typeGuards';
import { Message } from './index';
import { errorMessage } from '../utils/helpers';

const realUser = {
  userId: '123abc',
  userName: 'user1',
  password: 'pword',
  createdLists: [],
  subscribedLists: [],
  online: false,
};

const realItem = {
  itemId: '123abc',
  creatorId: 'user1',
  description: 'Todo',
  listId: 'list1',
  done: false,
};

const realList = {
  listId: '123abc',
  listName: 'list1',
  creatorId: 'user1',
  users: ['user1'],
  items: [],
};

const realError = errorMessage(Message.USER_NOT_FOUND);

describe('Testing typeguards', () => {
  it('isUser should be truthy', () => {
    expect(isUser(realUser)).toEqual(true);
  });

  it('isUser should be falsy', () => {
    expect(isUser(realItem)).toEqual(false);
  });

  it('isItem should be truthy', () => {
    expect(isItem(realItem)).toEqual(true);
  });

  it('isItem should be falsy', () => {
    expect(isItem(realUser)).toEqual(false);
  });

  it('isList should be truthy', () => {
    expect(isList(realList)).toEqual(true);
  });

  it('isList should be falsy', () => {
    expect(isList(realUser)).toEqual(false);
  });

  it('isError should be truthy', () => {
    expect(isError(realError)).toEqual(true);
  });

  it('isError should be falsy', () => {
    expect(isError(realUser)).toEqual(false);
  });
});
