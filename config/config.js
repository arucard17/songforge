var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'songforge'
    },
    port: 3000,
    db: {
      host: 'localhost',
      port: '33060',
      dbname: 'song_db',
      user: 'homestead',
      password: 'secret'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'songforge'
    },
    port: 3000,
    db: 'mysql://localhost/songforge-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'songforge'
    },
    port: 3000,
    db: 'mysql://localhost/songforge-production'
  }
};

module.exports = config[env];
