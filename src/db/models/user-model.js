const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
	user_id: {
		type: Number,
		required: true,
		index: true
	},
	user_name: {
		type: String,
		unique: true,
		required: true,
		index: true
	},
	first_name: String,
	last_name: String
});
userSchema.plugin(AutoIncrement, {id: 'user.user_id', inc_field: 'user_id', collection_name: 'sequences'});

module.exports = mongoose.model('User', userSchema);
