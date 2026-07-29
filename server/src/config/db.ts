import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    const connection = await mongoose.connect(mongoUri);
    console.log(`[💾 MongoDB]: Successfully connected to host: ${connection.connection.host}`);
  } catch (error) {
    console.error('[❌ MongoDB Connection Error]:', error);
    process.exit(1); // Exit process with failure code if connection fails
  }
};
