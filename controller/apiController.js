const { v7: uuidv7 } = require('uuid');
const Profile = require('../model/database');
const {
	fetchExternalData,
	validateGenderize,
	validateAgify,
	validateNationalize
} = require('../utils/externalApi');
const { getAgeGroup, getTopCountry } = require('../utils/utils');

module.exports.get_all = async(req, res) => {
	try {
		
	} catch (error) {
		
	}
};

module.exports.post_one = async(req, res) => {
	try {
		let { name } = req.body;

		if (!name) {
			return res.status(400).json({
				status: "error",
				message: "Missing or empty name"
			});
		}

		if (typeof name != "string") {
			return res.status(422).json({
				status: "error",
				message: "Invalid type"
			});
		}

		name = name.trim().toLowerCase();

		// Check duplicate
		const existing = await Profile.findOne({ name });
		if (existing) {
			return res.status(200).json({
				status: "success",
				message: "Profile already exists",
				data: existing
			});
		}

		//Fetch APIs
		const { gender, age, nation } = await fetchExternalData(name);

		//Validate responses
		validateGenderize(gender);
		validateAgify(age);
		validateNationalize(nation);

		const topCountry = getTopCountry(nation.country);

		const profile = {
			id: uuidv7(),
			name,
			gender: gender.gender,
			gender_probability: gender.probability,
			sample_size: gender.count,
			age: age.age,
			age_group: getAgeGroup(age.age),
			country_id: topCountry.country_id,
			country_probability: topCountry.probability,
			created_at: new Date().toISOString()
		};

		const saved = await Profile.create(profile);

		return res.status(201).json({
			status: "success",
			data: saved
		});

	} catch (err) {
		if (err.status) {
			return res.status(err.status).json({
				status: "error",
				message: err.message
			});
		}
		return res.status(500).json({
			status: "error",
			message: "server error"
		});
	}
};

module.exports.get_one = async(req, res) => {

};

module.exports.delete_one = async(req, res) => {

};