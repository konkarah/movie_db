import User, { IUser } from "../models/user.models";
import { connect } from "../mongodb/mongoose";

// Clerk email type
interface ClerkEmailAddress {
  email_address: string;
  id: string;
  verification: {
    status: string;
    strategy: string;
  };
}

// Database representation
interface DatabaseUser {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  favs: IUser["favs"];
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

// Convert Mongoose doc -> DatabaseUser
const convertToDatabaseUser = (
  user: IUser & { __v?: number }
): DatabaseUser => {
  return {
    _id: user._id.toString(),
    clerkId: user.clerkId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicture: user.profilePicture,
    favs: user.favs,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    __v: user.__v,
  };
};

export const createOrUpdateUser = async (
  id: string,
  first_name: string,
  last_name: string,
  image_url: string,
  email_addresses: ClerkEmailAddress[]
): Promise<DatabaseUser> => {
  try {
    await connect();

    const userDoc = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0]?.email_address,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    if (!userDoc) throw new Error("User not found or created");

    return convertToDatabaseUser(userDoc as IUser & { __v?: number });
  } catch (error) {
    console.error("Error: Could not create/update user", error);
    throw new Error(
      `Could not create/update user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await connect();
    const result = await User.findOneAndDelete({ clerkId: id });
    if (!result) console.warn(`User with clerkId ${id} not found for deletion`);
  } catch (error) {
    console.error("Error: Could not delete user", error);
    throw new Error(
      `Could not delete user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getUserByClerkId = async (
  clerkId: string
): Promise<DatabaseUser | null> => {
  try {
    await connect();
    const userDoc = await User.findOne({ clerkId }).lean<IUser & { __v?: number }>();
    if (!userDoc) return null;
    return convertToDatabaseUser(userDoc);
  } catch (error) {
    console.error("Error fetching user by clerkId:", error);
    throw new Error(
      `Could not fetch user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const updateUserFavorites = async (
  clerkId: string,
  favorites: DatabaseUser["favs"]
): Promise<DatabaseUser> => {
  try {
    await connect();

    const userDoc = await User.findOneAndUpdate(
      { clerkId },
      { $set: { favs: favorites } },
      { new: true, runValidators: true }
    );

    if (!userDoc) throw new Error("User not found");

    return convertToDatabaseUser(userDoc as IUser & { __v?: number });
  } catch (error) {
    console.error("Error updating user favorites:", error);
    throw new Error(
      `Could not update favorites: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
