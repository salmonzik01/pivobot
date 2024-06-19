import { getModelForClass, prop } from "@typegoose/typegoose";

export class User {
  @prop({ index: true })
  userId!: string;

  @prop({ default: 0 })
  litersOfBeer!: number;
}

export const UserModel = getModelForClass(User);

export async function findOrCreate(userId: string) {
  const user = await UserModel.findOneAndUpdate(
    { userId },
    {},
    { new: true, upsert: true }
  );

  return user;
}
