const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const gametimeSchema = new mongoose.Schema({
	gametime_id: {
		type: Number,
		index: true
	},
	game_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	hours: Number,
	minutes: Number,
	seconds: Number, 
	milliseconds: Number,
	start_date: Date,
	end_date: Date, //! Depricated 
	note: String
}, {collection: 'gametime'});
gametimeSchema.plugin(AutoIncrement, {id: 'gametime.gametime_id', inc_field: 'gametime_id', collection_name: 'sequences'});

module.exports = mongoose.model('GameTime', gametimeSchema);
