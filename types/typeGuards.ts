import { User, ErrorMessage, Item, List } from '../types';

type InputOptions = User | ErrorMessage | Item | List;
export const isUser = (input: InputOptions): input is User => {
  return (input as User).userId !== undefined;
};

export const isItem = (input: InputOptions): input is Item => {
  return (input as Item).itemId !== undefined;
};

export const isList = (input: InputOptions): input is List => {
  return (input as List).listId !== undefined;
};

export const isError = (input: InputOptions): input is ErrorMessage => {
  return (input as ErrorMessage).type === 'Error';
};
