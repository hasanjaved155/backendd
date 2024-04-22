const mongoose = require('mongoose');

const connecDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successefully");

    } catch (error) {
        console.log("Error in mongodb connection")
    }
}


module.exports = connecDB;