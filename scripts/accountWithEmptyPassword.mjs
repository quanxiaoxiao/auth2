import assert from 'node:assert';
import {
  createAccount,
  updateAccount,
  createSession,
  getSessionValid,
  getSession,
  getAccountByUsername,
  removeAccount,
  createSessionByAccount,
  getAccountSessions,
} from './apis.mjs';

const username = 'empty_passowrd_123';

{
  const ret = await getAccountByUsername(username);
  if (ret) {
    await removeAccount(ret._id);
  }
}

const accountItem = await createAccount({
  username: username,
  password: null,
});

assert(accountItem);
assert.equal(accountItem.username, username);

let sessionItem = await createSessionByAccount({
  account: accountItem._id,
});

assert(sessionItem);

assert.equal(sessionItem.account._id, accountItem._id);

const token1 = sessionItem.token;

{
  const validate = await getSessionValid(token1);

  assert(validate);
}

{
  const ret = await createSession({
    username,
    password: '123456',
  });
  assert.equal(ret, null);
}

{
  const ret = await createSession({
    username,
    password: null,
  });
  assert.equal(ret, null);
}


{
  const ret = await updateAccount({
    account: accountItem._id,
    data: {
      password: '123456',
    },
  });
  assert(ret);
  assert.equal(ret._id, accountItem._id);
  const validate = await getSessionValid(token1);
  assert(!validate);
}

{
  const ret = await getSession(sessionItem._id);
  const now = Date.now();
  assert(ret);
  assert(now > ret.dateTimeExpired);
  assert.equal(ret._id, sessionItem._id);
}

sessionItem  = await createSession({
  username,
  password: '123456',
});

assert(sessionItem);
assert.equal(sessionItem.account._id, accountItem._id);

assert(token1 !== sessionItem.token);

const token2 = sessionItem.token;

{
  const validate = await getSessionValid(token2);
  assert(validate);
}

{
  const validate = await getSessionValid(token1);
  assert(!validate);
}

{
  const ret = await updateAccount({
    account: accountItem._id,
    data: {
      password: '111111',
    },
  });
  assert(ret);
  const validate = await getSessionValid(token2);
  assert(!validate);
}

{
  const ret = await createSession({
    username,
    password: '123456',
  });
  assert.equal(ret, null);
}

sessionItem  = await createSession({
  username,
  password: '111111',
});

assert(sessionItem);

const token3 = sessionItem.token;

{
  const validate = await getSessionValid(token3);
  assert(validate);
}

{
  const validate = await getSessionValid(token2);
  assert(!validate);
}

{
  const ret = await updateAccount({
    account: accountItem._id,
    data: {
      password: '123456',
    },
  });
  assert(ret);
}

{
  const validate = await getSessionValid(token3);
  assert(!validate);
}

{
  const validate = await getSessionValid(token2);
  assert(!validate);
}

{
  const validate = await getSessionValid(token1);
  assert(!validate);
}

{
  const ret = await createSession({
    username,
    password: '111111',
  });
  assert.equal(ret, null);
}

sessionItem = await createSession({
  username,
  password: '123456',
});

assert(sessionItem);

const token4 = sessionItem.token;

assert(token4 !== token2);

{
  const ret = await updateAccount({
    account: accountItem._id,
    data: {
      password: '123456',
    },
  });
  assert(ret);
}

let sessionList = await getAccountSessions(accountItem._id);

await sessionList.reduce(async (acc, cur) => {
  await acc;
  assert.equal(cur.account._id, accountItem._id);
  const validate = await getSessionValid(token1);
  assert(!validate);
}, Promise.resolve);

sessionItem = await createSession({
  username,
  password: '123456',
});

assert(sessionItem);

const token5 = sessionItem.token;

assert(token5 !== token4);

await removeAccount(accountItem._id);

sessionItem = await createSession({
  username,
  password: '123456',
});

assert.equal(sessionItem, null);

sessionList = await getAccountSessions(accountItem._id);
assert.deepEqual(sessionList, []);

const accountItem2 = await createAccount({
  username: username,
  password: '111222',
});

assert(accountItem2);
assert(accountItem2._id !== accountItem._id);


sessionList = await getAccountSessions(accountItem._id);
assert.deepEqual(sessionList, []);
sessionList = await getAccountSessions(accountItem2._id);
assert.deepEqual(sessionList, []);

sessionItem = await createSession({
  username,
  password: '123456',
});

assert.equal(sessionItem, null);

sessionList = await getAccountSessions(accountItem2._id);
assert.deepEqual(sessionList, []);

sessionList = await getAccountSessions(accountItem._id);
assert.deepEqual(sessionList, []);

sessionItem = await createSession({
  username,
  password: '111222',
});

assert(sessionItem);

assert.equal(sessionItem.account._id, accountItem2._id);

sessionList = await getAccountSessions(accountItem._id);
assert.deepEqual(sessionList, []);

sessionList = await getAccountSessions(accountItem2._id);
assert.equal(sessionList.length, 1);
assert.equal(sessionList[0]._id, sessionItem._id);

await removeAccount(accountItem2._id);
