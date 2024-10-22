import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import assert from 'node:assert';
import request from '@quanxiaoxiao/http-request';
import { decodeContentToJSON } from '@quanxiaoxiao/http-utils';
import {
  createAccount,
  createSession,
  removeAccount,
  getSessionValid,
  getAccountByUsername,
} from './apis.mjs';

const accountList = [
  {
    username: 'rui',
    nickName: 'ruirui',
    password: '123456',
    avatar: fs.readFileSync(path.resolve(process.cwd(), 'avatar', 'rui.png')),
  },
];

await accountList.reduce(async (acc, cur) => {
  await acc;
  let accountItem = await getAccountByUsername(cur.username);
  if (accountItem) {
    await removeAccount(accountItem._id);
  }
  let avatar = null;
  if (cur.avatar) {
    const responseItem = await request(
      {
        path: `/upload/avatar?name=avatar.png`,
        method: 'POST',
        body: cur.avatar,
      },
      {
        hostname: '127.0.0.1',
        port: 4059,
      },
    );
    if (responseItem.statusCode === 200) {
      const data = decodeContentToJSON(responseItem.body, responseItem.headers);
      avatar = data._id;
    }
  }
  accountItem = await createAccount({
    username: cur.username,
    nickName: cur.nickName,
    password: cur.password,
    avatar,
  });
  console.log(`createAccount \`${JSON.stringify(accountItem)}\``);
  const sessionItem = await createSession({
    username: cur.username,
    password: cur.password,
  });
  assert(sessionItem);
  const ret = await getSessionValid(sessionItem.token);
  assert(ret);
}, Promise.resolve);
