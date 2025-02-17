const tap = require('tap');
const app = require('../src/index.js');

tap.test('GET /health', async (t) => {
  t.teardown(() => app.close());

  const response = await app.inject({
    method: 'GET',
    url: '/health'
  });

  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.payload), { status: 'ok' });
});