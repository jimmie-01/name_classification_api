const axios = require('axios');

const fetchExternalData = async (name) => {
	const [genderRes, ageRes, nationRes] = await Promise.all([
		axios.get(`https://api.genderize.io?name=${name}`),
		axios.get(`https://api.agify.io?name=${name}`),
		axios.get(`https://api.nationalize.io?name=${name}`)
	]);

	return {
		gender: genderRes.data,
		age: ageRes.data,
		nation: nationRes.data
	};
}

const validateGenderize = (data) => {
	if (!data.gender || data.count === 0) {
		throw {
			status: 502,
			message: "Genderize returned an invalid response"
		};
	}
}

const validateAgify = (data) => {
	if (data.age === null) {
		throw { 
			status: 502,
			message: "Agify returned an invalid response"
		};
	}
}

const validateNationalize = (data) => {
	if (!data.country || data.country.length === 0) {
		throw {
			status: 502,
			message: "Nationalize returned an invalid response"
		};
	}
}

module.exports = {
	fetchExternalData, 
	validateGenderize, 
	validateAgify, 
	validateNationalize
};