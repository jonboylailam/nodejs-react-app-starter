var Baobab = require('baobab');
var LocalStorage = require('local-storage');

var StateTree = new Baobab({
  loggedIn: {
    user: null
  }
});

StateTree.commit();

/**
 * Cursor is initialized with data from local storage (if any) and future updates are saved back.
 */
function cacheInLocalStorage(cursor, attachListener) {
  var c = StateTree.select(cursor);
  if (!Array.isArray(cursor)) cursor = [cursor];
  var key = "state-tree:" + cursor.join('/');

  var object;
  try {
    object = LocalStorage.get(key);
  } catch (error) {
    console.error("Bad values stored in local storage for ", cursor, error);
  }
  if (object) {
    if (cursor[0] != "views") object._fromCache = true;
    c.set(object);
  }

  c.on('update', () => {
    try {
      LocalStorage.set(key, c.get())
    } catch (error) {
      console.error("Problem setting local storage for", cursor, error);
    }
  });

  // if this is true attach a listener on local storage so that these changes will be shared across tabs
  if (attachListener) {
    LocalStorage.on(key, (value) => {
      c.set(value);
    });
  }
}

cacheInLocalStorage(['loggedIn', 'user'], true);

module.exports = StateTree;