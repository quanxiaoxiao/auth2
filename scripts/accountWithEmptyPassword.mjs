import assert from 'node:assert';
import {
  createAccount,
  updateAccount,
  createSession,
  getSessionValid,
  getAccountByUsername,
  removeAccount,
  createSessionByAccount,
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

/*
{
  const ret = await getSession(sessionItem._id);
  console.log(ret);
  const now = Date.now();
  assert(ret);
  assert(now > ret.dateTimeExpired);
  assert.equal(ret._id, sessionItem._id);
}
*/

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
