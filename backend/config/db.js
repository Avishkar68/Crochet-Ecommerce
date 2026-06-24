import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n==================================================================');
    console.error(`🔴 MongoDB Connection Error: ${error.message}`);
    console.error('👉 Please make sure MongoDB is running or add a valid connection string in your .env file!');
    console.error('==================================================================\n');
  }
}
