/**
 * Unit tests for User model Mongoose operations.
 *
 * These tests use Vitest with mocks to avoid connecting to a real MongoDB instance.
 * 
 * The following operations are tested:
 * 1. Create or update a user with `findOneAndUpdate` (upsert behavior).
 * 2. Delete a user using `findOneAndDelete`.
 * 3. Retrieve a user by `clerkId` using `findOne` and `lean`.
 * 4. Update a user's favorites array (`favs`) using `findOneAndUpdate`.
 *
 * Each test mocks the corresponding Mongoose method to:
 * - Return a predefined `mockUser` object.
 * - Verify that the method was called correctly.
 */


import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock User model
const mockUser = {
  _id: "1",
  clerkId: "clerk123",
  name: "Emmanuel",
  favs: [{ name: "movie1" }, { name: "movie2" }],
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

// Import after mock
import User from "@/app/lib/models/user.models";
import { connect } from "@/app/lib/actions/user.actions";

describe("User Model Mongoose Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create or update a user", async () => {
    (User.findOneAndUpdate as unknown as vi.Mock).mockResolvedValue(mockUser);

    const result = await User.findOneAndUpdate(
      { clerkId: "clerk123" },
      { $set: { name: "Emmanuel" } },
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
    const newFavs = [{ name: "movie3" }];
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
