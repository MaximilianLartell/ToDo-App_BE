import * as dotenv from 'dotenv';

dotenv.config();

export const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@reminderapp.czpki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
