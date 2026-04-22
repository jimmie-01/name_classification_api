require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//Connect to DB
const connectDB = async() => {
	try {
		mongoose.set('strictQuery', false);
		const conn = await mongoose.connect(process.env.DB_URL);
		console.log(`Database Connected ${conn.connection.host}`);
	} catch (error) {
		console.error(error);
	}
}
connectDB();
//Middleware
app.use(cors()); //Allow CORS for all origin
app.use(bodyParser.json());

app.use(apiRoutes);

app.listen(PORT, ()=> {
	console.log(`Server listening for request on port ${PORT}`);
})
