import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFav {
  movieId: string;
  title: string;
  description: string;
  dateReleased: Date;
  rating: number;
  image: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId; // ✅ Explicitly typed
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  favs: IFav[];
  createdAt: Date;
  updatedAt: Date;
}

const favSchema = new Schema<IFav>({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },     // changed
  dateReleased: { type: Date, required: false },      // changed
  rating: { type: Number, required: false },          // changed
  image: { type: String, required: false },           // changed
});


const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String, required: true },
    favs: { type: [favSchema], default: [] },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
