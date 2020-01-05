'use strict';
const mongoose = require('mongoose');
const Store = require('electron-store');

const GameModel = require('./models/game-model');
const UserModel = require('./models/user-model');
const GametimeModel = require('./models/gametime-model');

const store = new Store();

const mongoHost = store.get('databases.mongodb.host');
const mongoPort = store.get('databases.mongodb.port');
const mongoUsername = store.get('databases.mongodb.username');
const mongoPass = store.get('databases.mongodb.password');
const mongoAuthSrc = store.get('databases.mongodb.authentication_source');
const mongoURI = `mongodb://${mongoUsername}:${mongoPass}@${mongoHost}:${mongoPort}/gameplay_tracker?authSource=${mongoAuthSrc}`

mongoose.connect(mongoURI, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

console.log('db-connection loaded');