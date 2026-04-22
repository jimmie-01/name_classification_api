const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
	id: {
		type: String, 
		required: true, 
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	gender: String,
	gender_probability: Number,
	sample_size: Number,
	age: Number,
	age_group: String,
	country_id: String,
	country_probability: Number,
	created_at: { type: String }
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;