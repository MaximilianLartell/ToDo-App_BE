import mongoose from 'mongoose';
import { PasswordDb } from '../../types';

const PasswordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
});

const PasswordModel = mongoose.model<PasswordDb>('passwords', PasswordSchema);

export default PasswordModel;
