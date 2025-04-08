const { default: mongoose } = require("mongoose");

const dbconnect = async() => {
    try {
        const url = process.env.MONGO_URI;
        await mongoose.connect(url);
        mongoose.connection.on('connected', () => {
            console.log('Database connected successfully');
        });

        mongoose.connection.on('error', (error) => {
            console.error('Database connection error:', error);
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = dbconnect