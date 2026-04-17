const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
	console.log(`Server listening for request on port ${PORT}`);
})
