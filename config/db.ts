import mongoose from 'mongoose';

export const MONGODB_URI = process.env.MONGODB_URI!;

export async function connect(): Promise<typeof mongoose> {
  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}
