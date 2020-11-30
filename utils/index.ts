// this will contain helper functions
import { Error } from '../types';

export const error = (code: number, message: string): Error => ({
  code,
  error: message,
});

export const NewUtil = 'coming';
