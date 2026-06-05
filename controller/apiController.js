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
	const { gender, country_id, age_group } = req.query;

	const filter = {};

	if (gender) filter.gender = 
	gender.toLowerCase();
	if (country_id) filter.country_id = 
	country_id.toUpperCase();
	if (age_group) filter.age_group = 
	age_group.toLowerCase();

	const profiles = await Profile.find(filter).select(
		"id name gender age age_group country_id"
	);

	res.status(200).json({
		status: "Success",
		count: profiles.length,
		data: profiles
	});
};

// Create profile
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

		// console.dir(nation, { depth: null });

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

// Get single profile
module.exports.get_one = async(req, res) => {
	const { id } = req.params;

	const profile = await Profile.findOne({ id });

	if (!profile) {
		return res.status(404).json({
			status: "error",
			message: "Profile not found"
		});
	}

	return res.status(200).json({
		status: "success",
		data: profile
	});
};

module.exports.delete_one = async(req, res) => {
	//const { id } = req.params.id;

	const deleted = await Profile.findOneAndDelete({ _id: req.params.id });

	if (!deleted) {
		return res.status(404).json({
			status: "Error",
			message: "Profile not found"
		});
	}

	return res.status(204).send()
};