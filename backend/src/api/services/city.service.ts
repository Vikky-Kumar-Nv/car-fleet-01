import { City } from '../models/city.model';

export const listCities = async () => {
  return City.find().sort({ name: 1 });
};

export const createCity = async (name: string) => {
  const exists = await City.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
  if (exists) return exists;
  const city = new City({ name });
  await city.save();
  return city;
};

export const deleteCity = async (id: string) => {
  await City.findByIdAndDelete(id);
};
