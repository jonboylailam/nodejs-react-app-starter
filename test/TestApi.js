var test = require('tape');
var ClientApi = require('../client/app/api');

test('Test the api get call', (t) => {
  t.plan(2);

  var api = ClientApi();
  api.getTest({q: 'hello from the client'}).subscribe((ans) => {
    console.log(ans);
    t.equals(ans.message, 'hello from the server', 'The message was return as expected');
    t.equals(ans.youSaid, 'hello from the client', 'The message was return as expected');
  });
});

test('Test the api post call', (t) => {
  t.plan(1);

  var api = ClientApi();
  api.postTest({message: 'hello from the server'}).subscribe((ans) => {
    console.log(ans);
    t.equals(ans.message, 'hello from the server', 'The message was return as expected');
  });
});