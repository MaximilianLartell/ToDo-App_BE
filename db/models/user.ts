import mongoose from 'mongoose';
import { UserDb } from '../../types';

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  createdLists: { type: [String], required: true },
  subscribedLists: { type: [String], required: true },
  online: { type: Boolean, required: true },
});

const UserModel = mongoose.model<UserDb>('users', UserSchema);

export default UserModel;
