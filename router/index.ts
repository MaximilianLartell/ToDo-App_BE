import express from 'express';
import { signIn, validateCredentials, createUser } from '../service';
import { findUserById } from '../service/remote/users';
import { findManyLists } from '../service/remote/lists';
import { findManyItems } from '../service/remote/items';
import { isError } from '../types/typeGuards';
import { reqIdParser } from '../utils/helpers';

const router = express.Router();

router.post('/auth/sign-in', async (req, res) => {
  try {
    const credentials = req.body;
    const auth = await validateCredentials(credentials);
    if (isError(auth)) {
      res.statusCode = 403;
      res.json(auth);
    } else {
      const user = await signIn(credentials.userName);
      res.json(user);
    }
  } catch (err) {
    res.statusCode = 500;
    res.json(err.message);
  }
});

router.post('/users', async (req, res) => {
  const credentials = req.body;
  try {
    const user = await createUser(credentials);
    if (isError(user)) {
      res.statusCode = 400;
      res.json(user);
    } else {
      res.json(user);
    }
  } catch (err) {
    res.statusCode = 500;
    res.json(err.message);
  }
});

router.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await findUserById(id);
    if (isError(user)) {
      res.statusCode = 400;
      res.json(user);
    } else {
      res.json(user);
    }
  } catch (err) {
    res.statusCode = 500;
    res.json(err.message);
  }
});

router.get('/lists/:id', async (req, res) => {
  const ids = reqIdParser(req.params.id);
  try {
    const lists = await findManyLists(ids);
    res.json(lists);
  } catch (err) {
    res.statusCode = 500;
    res.json(err.message);
  }
});

router.get('/items/:id', async (req, res) => {
  const ids = reqIdParser(req.params.id);
  try {
    const items = await findManyItems(ids);
    res.json(items);
  } catch (err) {
    res.statusCode = 500;
    res.json(err.message);
  }
});

export default router;
