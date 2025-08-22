import { Schema, model } from 'mongoose';

export interface ICityDoc {
  name: string;
  createdAt: Date;
}

const citySchema = new Schema<ICityDoc>({
  name: { type: String, required: true, unique: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export const City = model<ICityDoc>('City', citySchema);
