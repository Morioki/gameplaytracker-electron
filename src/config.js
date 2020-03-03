'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		favoriteAnimal: '🦄',
		databases: {
			mongodb: {
				host: 'localhost',
				port: 27017,
				db: 'test',
				username: 'username',
				password: 'password',
				authentication_source: 'admin'
			}
		}
	}
});
