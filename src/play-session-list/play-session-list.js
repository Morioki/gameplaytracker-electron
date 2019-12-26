const stubData = require('../stub-data');

// DOM elements
const createNew = document.querySelector('#create-new');
const playSessionList = document.querySelector('.play-session-list');


// Load Play Session List Selector
const playSessions = stubData.playSessionList;

playSessions.forEach(sesh => {
	// TODO Add rendering of each data element
});


console.log('Play Session List Loaded')