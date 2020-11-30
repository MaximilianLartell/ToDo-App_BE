import mongoose from 'mongoose';
import { ItemDb } from '../../types';

const ItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  creatorId: { type: String, required: true },
  description: { type: String, required: true },
  listId: { type: String, required: true },
  done: { type: Boolean, required: true },
});

const ItemModel = mongoose.model<ItemDb>('items', ItemSchema);

export default ItemModel;
