import assert from 'node:assert';
import dayjs from 'dayjs';
import { Semaphore } from '@quanxiaoxiao/utils';
import {
  createAccount,
  updateAccount,
  createSession,
  getSession,
  updateSession,
  getSessionValid,
  getAccountByUsername,
  removeAccount,
  getAccountSessions,
  createSessionByAccount,
} from './apis.mjs';

const accountNull = await createAccount({
  username: '    ',
  password: '134',
});

assert.equal(accountNull, null);

const sem = new Semaphore(8);

const testSessionUnableCreate = async ({
  username,
  password,
}) => {
  const sessionItem = await createSession({
    username,
    password,
  });
  assert(!sessionItem);
};

const testAccountRemove = async (account) => {
  const accountItem = await removeAccount(account);
  assert(accountItem);
  const sessionList = await getAccountSessions(accountItem._id);
  assert(sessionList.length === 0);
};

const testAccountSessionsExpired = async (account) => {
  const sessionList = await getAccountSessions(account);
  const now = Date.now();
  assert(sessionList.length > 0);
  assert(sessionList.every((d) => d.dateTimeExpired < now));
};

const testSessionsCreate = async ({
  account,
  username,
  password,
  count = 1,
}) => {
  const sessionList = [];
  await new Array(count).fill(0).reduce(async (acc) => {
    await acc;
    const sessionItem = await createSession({ username, password });
    assert(sessionItem);
    sessionList.push({
      username,
      password,
      data: sessionItem,
    });
  }, Promise.resolve);
  await sessionList.reduce(async (acc, sessionItem) => {
    await acc;
    const valid = await getSessionValid(sessionItem.data.token);
    assert(valid);
  }, Promise.resolve);

  await updateAccount({
    account,
    data: {
      dateTimeExpired: dayjs().subtract(1, 'day').valueOf(),
    },
  });
  await testAccountSessionsExpired(account);
  await sessionList.reduce(async (acc, sessionItem) => {
    await acc;
    const valid = await getSessionValid(sessionItem.data.token);
    assert(!valid);
  }, Promise.resolve);
  await updateAccount({
    account,
    data: {
      dateTimeExpired: dayjs().add(1, 'day').valueOf(),
    },
  });
  await testAccountSessionsExpired(account);
  await sessionList.reduce(async (acc, sessionItem) => {
    await acc;
    const valid = await getSessionValid(sessionItem.data.token);
    assert(!valid);
  }, Promise.resolve);
};

const pipeline = async ({
  username,
  password,
  passwordNew,
}) => {
  console.log(`account \`${username}\` will test...`);
  const accountMatched = await getAccountByUsername(username);
  if (accountMatched) {
    const data = await removeAccount(accountMatched._id);
    assert(data);
  }
  await testSessionUnableCreate({
    username,
    password,
  });
  const accountItem = await createAccount({
    username,
    password,
  });

  assert(accountItem);

  const accountSession = await createSessionByAccount({
    account: accountItem._id,
  });

  assert(accountSession);

  const accountEmpty = await createAccount({
    username,
    password,
  });

  assert(accountEmpty == null);

  await testSessionUnableCreate({
    username,
    password: `${password}1`,
  });

  await testSessionsCreate({
    username,
    password,
    count: 10,
    account: accountItem._id,
  });

  const accountItemUpdateRet = await updateAccount({
    account: accountItem._id,
    data: {
      password: passwordNew,
    },
  });

  assert(typeof accountItemUpdateRet.dateTimeUpdateWithPassword === 'number');
  assert(Date.now() > accountItemUpdateRet.dateTimeUpdateWithPassword);
  assert((Date.now() - 1000 * 5) < accountItemUpdateRet.dateTimeUpdateWithPassword);

  await testSessionUnableCreate({
    username,
    password,
  });

  await testSessionsCreate({
    username,
    password: passwordNew,
    count: 10,
    account: accountItem._id,
  });

  const sessionItem = await createSession({
    username,
    password: passwordNew,
  });
  assert(sessionItem);

  let sessionValid = await getSessionValid(sessionItem.token);
  assert(sessionValid);

  await updateSession({
    session: sessionItem._id,
    data: {
      dateTimeExpired: dayjs().subtract(2, 'day').valueOf(),
    },
  });

  sessionValid = await getSessionValid(sessionItem.token);
  assert(!sessionValid);

  await updateSession({
    session: sessionItem._id,
    data: {
      dateTimeExpired: dayjs().add(2, 'day').valueOf(),
    },
  });

  sessionValid = await getSessionValid(sessionItem.token);
  assert(sessionValid);

  await updateAccount({
    account: accountItem._id,
    data: {
      dateTimeExpired: dayjs().subtract(1, 'day').valueOf(),
    },
  });

  sessionValid = await getSessionValid(sessionItem.token);
  assert(!sessionValid);

  await updateSession({
    session: sessionItem._id,
    data: {
      dateTimeExpired: dayjs().add(2, 'day').valueOf(),
    },
  });

  sessionValid = await getSessionValid(sessionItem.token);
  assert(!sessionValid);

  await updateAccount({
    account: accountItem._id,
    data: {
      dateTimeExpired: dayjs().add(1, 'day').valueOf(),
    },
  });

  sessionValid = await getSessionValid(sessionItem.token);
  assert(!sessionValid);

  await updateSession({
    session: sessionItem._id,
    data: {
      dateTimeExpired: dayjs().add(2, 'day').valueOf(),
    },
  });

  sessionValid = await getSessionValid(sessionItem.token);
  assert(sessionValid);

  let sessionRet = await getSession(sessionItem._id);
  assert(sessionRet);

  await testAccountRemove(accountItem._id);

  const accountSession2 = await createSessionByAccount({
    account: accountItem._id,
  });

  assert(!accountSession2);

  sessionValid = await getSessionValid(sessionItem.token);
  assert(!sessionValid);
  sessionRet = await getSession(sessionItem._id);
  assert(!sessionRet);

  await testSessionUnableCreate({
    username,
    password: passwordNew,
  });
  console.log(`account \`${username}\` test ok`);
};

for (let i = 0; i < 20; i++) {
  const d = {
    username: `test_${i}`,
    password: `aaa+${i}`,
    passwordNew: `aaa+${i}__`,
  };
  sem.acquire(() => {
    pipeline({
      username: d.username,
      password: d.password,
      passwordNew: d.passwordNew,
    })
      .then(() => {
        sem.release();
      });
  });
}
