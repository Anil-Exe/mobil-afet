'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { requireAdmin } = require('./auth');

function response() {
  return {
    code: null, body: null,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('missing or malformed authorization never reaches the verifier', async () => {
  for (const authorization of [undefined, '', 'Basic demo', 'Bearer ', 'Bearer a b']) {
    let verified = false;
    const middleware = requireAdmin(async () => { verified = true; return { admin: true }; });
    const res = response();
    await middleware({ headers: { authorization } }, res, () => assert.fail('Unauthorized request accepted'));
    assert.equal(res.code, 401);
    assert.equal(verified, false);
  }
});

test('invalid, revoked, or disabled-user tokens are rejected without exposing errors', async () => {
  const middleware = requireAdmin(async () => { throw new Error('private verifier details'); });
  const res = response();
  await middleware({ headers: { authorization: 'Bearer test-token' } }, res,
    () => assert.fail('Invalid token accepted'));
  assert.equal(res.code, 401);
  assert.deepEqual(res.body, { error: 'Invalid authentication.' });
});

test('an authenticated user needs a boolean administrator claim', async () => {
  for (const claims of [{ uid: 'demo' }, { uid: 'demo', admin: false }, { uid: 'demo', admin: 'true' }, null]) {
    const middleware = requireAdmin(async () => claims);
    const res = response();
    await middleware({ headers: { authorization: 'Bearer test-token' } }, res,
      () => assert.fail('Non-administrator accepted'));
    assert.equal(res.code, 403);
  }
});

test('administrator authentication checks revocation and passes only the user identifier', async () => {
  let advanced = 0;
  const middleware = requireAdmin(async (token, revoked) => {
    assert.equal(token, 'test-token');
    assert.equal(revoked, true);
    return { uid: 'demo-admin', admin: true, extraPrivateClaim: 'not forwarded' };
  });
  const req = { headers: { authorization: 'Bearer test-token' } };
  const res = response();
  await middleware(req, res, () => { advanced += 1; });
  assert.equal(advanced, 1);
  assert.deepEqual(req.auth, { uid: 'demo-admin' });
  assert.equal(res.code, null);
});
