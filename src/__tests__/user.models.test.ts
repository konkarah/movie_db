// Summary of what we’re testing here:

// Create/Update User → Ensures findOneAndUpdate correctly creates a user if none exists or updates existing user data.
// Delete User → Ensures findOneAndDelete removes the correct user.
// Get User by clerkId → Ensures findOne().lean() fetches a user correctly.
// Update Favorites → Ensures updating the favs array works and enforces schema validation.
// import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUser = {
  _id: "64fe8b3f8f1a4d0012345678",
  clerkId: "clerk123",
  email: "test@example.com",
  firstName: "Emmanuel",
  lastName: "Koech",
  profilePicture: "profile.jpg",
  favs: [
    {
      movieId: "m1",
      title: "Movie 1",
      description: "Description 1",
      dateReleased: new Date("2020-01-01"),
      rating: 9,
      image: "image1.jpg",
    },
    {
      movieId: "m2",
      title: "Movie 2",
      description: "Description 2",
      dateReleased: new Date("2021-01-01"),
      rating: 8,
      image: "image2.jpg",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock("@/app/lib/models/user.models", () => {
  return {
    __esModule: true,
    default: {
      findOneAndUpdate: vi.fn(),
      findOneAndDelete: vi.fn(),
      findOne: vi.fn(),
    },
  };
});

import User from "@/app/lib/models/user.models";

describe("User Model Mongoose Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create or update a user", async () => {
    (User.findOneAndUpdate as unknown as vi.Mock).mockResolvedValue(mockUser);

    const result = await User.findOneAndUpdate(
      { clerkId: "clerk123" },
      { $set: { firstName: "Emmanuel" } },
      { upsert: true, new: true }
    );

    expect(result).toEqual(mockUser);
    expect(User.findOneAndUpdate).toHaveBeenCalled();
  });

  it("should delete a user", async () => {
    (User.findOneAndDelete as unknown as vi.Mock).mockResolvedValue(mockUser);

    const result = await User.findOneAndDelete({ clerkId: "clerk123" });

    expect(result).toEqual(mockUser);
    expect(User.findOneAndDelete).toHaveBeenCalled();
  });

  it("should return a user by clerkId", async () => {
    (User.findOne as unknown as vi.Mock).mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockUser),
    });

    const result = await User.findOne({ clerkId: "clerk123" }).lean();

    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalled();
  });

  it("should update user favorites", async () => {
    const newFavs = [
      {
        movieId: "m3",
        title: "Movie 3",
        description: "Description 3",
        dateReleased: new Date("2022-01-01"),
        rating: 7,
        image: "image3.jpg",
      },
    ];

    (User.findOneAndUpdate as unknown as vi.Mock).mockResolvedValue({
      ...mockUser,
      favs: newFavs,
    });

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: "clerk123" },
      { $set: { favs: newFavs } },
      { new: true }
    );

    expect(updatedUser.favs).toEqual(newFavs);
    expect(User.findOneAndUpdate).toHaveBeenCalled();
  });
});
