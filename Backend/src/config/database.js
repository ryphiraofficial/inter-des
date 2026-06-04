import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`❌ Mongoose connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  Mongoose disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🛑 Mongoose connection closed through app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
