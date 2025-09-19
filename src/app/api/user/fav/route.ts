import User from '../../../lib/models/user.models';
import { connect } from '../../../lib/mongodb/mongoose';
import { currentUser, createClerkClient, type User as ClerkUser } from '@clerk/nextjs/server';

// Helper function to ensure user exists in MongoDB
const ensureUserExists = async (clerkUser: ClerkUser) => {
  await connect();

  // If user already has userMongoId, return it
  if (clerkUser.publicMetadata.userMongoId) {
    const existingUser = await User.findById(clerkUser.publicMetadata.userMongoId);
    if (existingUser) {
      return clerkUser.publicMetadata.userMongoId;
    }
  }

  // Check if user exists by Clerk ID
  let dbUser = await User.findOne({ clerkId: clerkUser.id });

  if (!dbUser) {
    // Create new user with all required fields
    dbUser = new User({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || 'noemail@example.com',
      firstName: clerkUser.firstName || 'User',
      lastName: clerkUser.lastName || 'Lastname', // ✅ Non-empty fallback
      profilePicture: clerkUser.imageUrl || '',
      favs: []
    });


    await dbUser.save();
    console.log('Created new user:', dbUser._id);
  }

  // Update Clerk metadata with userMongoId
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  await clerk.users.updateUserMetadata(clerkUser.id, {
    publicMetadata: {
      ...clerkUser.publicMetadata,
      userMongoId: dbUser._id.toString(),
    },
  });

  return dbUser._id.toString();
};

// PUT = Add or remove a favorite
export const PUT = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure user exists in MongoDB and has userMongoId
    const userMongoId = await ensureUserExists(user);

    let data;
    try {
      data = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data.movieId) {
      return new Response(JSON.stringify({ error: 'movieId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const movieId = String(data.movieId);

    const existingUser = await User.findById(userMongoId);
    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found in database' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let updatedUser;
    const isAlreadyFavorite = existingUser.favs.some((fav) => fav.movieId === movieId);

    if (isAlreadyFavorite) {
      // Remove
      updatedUser = await User.findByIdAndUpdate(
        userMongoId,
        { $pull: { favs: { movieId } } },
        { new: true, runValidators: true }
      );
    } else {
      // Add
      if (!data.title) {
        return new Response(JSON.stringify({ error: 'title is required when adding to favorites' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      updatedUser = await User.findByIdAndUpdate(
        userMongoId,
        {
          $addToSet: {
            favs: {
              movieId,
              title: data.title,
              description: data.overview || '',
              dateReleased: data.releaseDate ? new Date(data.releaseDate) : null,
              rating: data.voteCount ? Number(data.voteCount) : 0,
              image: data.image || '',
            },
          },
        },
        { new: true, runValidators: true }
      );
    }

    if (!updatedUser) {
      throw new Error('User update failed');
    }

    // Sync Clerk metadata
    try {
      const updatedFavs = updatedUser.favs.map((fav) => fav.movieId);
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          userMongoId: userMongoId,
          favs: updatedFavs,
        },
      });
    } catch (err) {
      console.error('Clerk metadata update error:', err);
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: updatedUser,
        action: isAlreadyFavorite ? 'removed' : 'added',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error in /api/user/fav PUT:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// GET = Retrieve all favorites
export const GET = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure user exists in MongoDB and has userMongoId
    const userMongoId = await ensureUserExists(user);

    const dbUser = await User.findById(userMongoId);

    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ favs: dbUser.favs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/user/fav GET:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};