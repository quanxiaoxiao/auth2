import assert from 'node:assert';
import {
  createAccount,
  createSession,
  getSessionValid,
  getAccountByUsername,
} from './apis.mjs';

const accountList = [
  {
    username: 'aaa',
    password: '123456',
  },
  {
    username: 'bbb',
    password: '123456',
  },
  {
    username: 'ccc',
    password: '123456',
  },
];

await accountList.reduce(async (acc, cur) => {
  await acc;
  let accountItem = await getAccountByUsername(cur.username);
  if (!accountItem) {
    console.log(`createAccount \`${JSON.stringify(cur)}\``);
    accountItem = await createAccount({
      username: cur.username,
      password: cur.password,
    });
  }
  const sessionItem = await createSession({
    username: cur.username,
    password: cur.password,
  });
  assert(sessionItem);
  const ret = await getSessionValid(sessionItem.token);
  assert(ret);
}, Promise.resolve);
