import mongoose from 'mongoose';
import { ListDb } from '../../types';

const ListSchema = new mongoose.Schema({
  listId: { type: String, required: true },
  listName: { type: String, required: true },
  creatorId: { type: String, required: true },
  users: { type: [String], required: true },
  items: { type: [String], required: true },
});

const ListModel = mongoose.model<ListDb>('lists', ListSchema);

export default ListModel;
