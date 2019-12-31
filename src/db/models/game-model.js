const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const gameSchema = new mongoose.Schema({
	game_id: {
		type: Number,
		required: true,
		index: true
	},
	game_title: {
		type: String,
		required: true
	},
	platform: String,
	genre: String,
	release_year: {
		type: Number,
		required: true
	},
	developer: String,
	publisher: String,
	franchise: String,
	series: String,
	image_path: String,
	game_note: String
});
gameSchema.plugin(AutoIncrement, { id: 'game.game_id', inc_field: 'game_id', collection_name: 'sequences'});

module.exports = mongoose.model('Game', gameSchema);
