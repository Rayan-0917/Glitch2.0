import imagekit from "../configs/imageKit.js"
import { inngest } from "../inngest/index.js";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import fs from 'fs'


const getUserIdFromReq = async (req) => {
  if (req.userId) return req.userId;

  let authData = req.auth;

  
  if (typeof req.auth === "function") {
    authData = await req.auth();
  }

  return (
    authData?.userId ||
    authData?.user_id ||
    authData?.sub ||
    null
  );
};


export const getUserData = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    
    let user = await User.findById(userId);

 
    if (!user) {
      const claims = req.auth.sessionClaims;

      user = await User.create({
        _id: userId,
        email: claims.email,
        full_name: `${claims.first_name || ""} ${claims.last_name || ""}`.trim(),
        username: (claims.email || userId).split("@")[0],
        bio: "",
        location: "",
        followers: [],
        following: [],
        connections: [],
      });
    }

    return res.json({ success: true, user });

  } catch (error) {
    console.error("getUserData error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const updateUserData = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    let { username, bio, location, full_name } = req.body;
    const tempUser = await User.findById(userId);
    if (!tempUser) return res.status(404).json({ success: false, message: 'User not found' });

    
    if (!username) username = tempUser.username;

   
    if (username !== tempUser.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        username = tempUser.username; 
      }
    }

    let updatedData = { username, bio, location, full_name };

    const profile = req.files?.profile && req.files.profile[0];
    const cover = req.files?.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '512' }
        ]
      });
      updatedData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '1280' }
        ]
      });
      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json({ success: true, user, message: 'Profile updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


export const discoverUsers = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const { input } = req.body;
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, 'i') },
        { email: new RegExp(input, 'i') },
        { full_name: new RegExp(input, 'i') },
        { location: new RegExp(input, 'i') },
      ]
    });

    const filteredUsers = allUsers.filter(u => u._id.toString() !== userId.toString());
    res.json({ success: true, users: filteredUsers });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


export const followUser = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const { id } = req.body; // id of the user to follow
    if (!id) return res.status(400).json({ success: false, message: 'Missing id in body' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    
    if (user.following.map(f => f.toString()).includes(id.toString())) {
      return res.json({ success: false, message: 'Already following user' });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    if (!toUser) return res.status(404).json({ success: false, message: 'Target user not found' });

    toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: 'Successfully followed user' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


export const unfollowUser = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Missing id in body' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.following = user.following.filter(f => f.toString() !== id.toString());
    await user.save();

    const toUser = await User.findById(id);
    if (toUser) {
      toUser.followers = toUser.followers.filter(f => f.toString() !== userId.toString());
      await toUser.save();
    }

    res.json({ success: true, message: 'Unfollowed user' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}



export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const { id } = req.body
    if (!id) return res.status(400).json({ success: false, message: 'Missing id in body' });

    //not more than 20 reqs in a day
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const connectionRequests = await Connection.find({ from_user_id: userId, createdAt: { $gt: last24Hours } })
    if (connectionRequests.length >= 20) {
      return res.json({ success: false, message: 'You cannot send more than 20 requests in a day' })
    }

    //check if already connected
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ]
    })

    if (!connection) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      })

      await inngest.send({
        name: 'app/connection-request',
        data: { connectionId: newConnection._id }
      })

      return res.json({ success: true, message: 'Connection request sent successully' })
    }
    else if (connection && connection.status === 'accepted') {
      return res.json({ success: false, message: 'Already connected with this user' })
    }
    return res.json({ success: false, message: 'Connection request pending' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


export const getUserConnections = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const user = await User.findById(userId);

    const connections = await User.find({ _id: { $in: user.connections } });
    const followers = await User.find({ _id: { $in: user.followers } });
    const following = await User.find({ _id: { $in: user.following } });

    const pending = await Connection.find({ to_user_id: userId, status: 'pending' })
      .populate('from_user_id');

    const pendingConnections = pending
      .map(c => c.from_user_id)
      .filter(u => u !== null); // remove nulls


    res.json({ success: true, connections, followers, following, pendingConnections });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const { id } = req.body

    const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId })

    if (!connection) {
      return res.json({ success: false, message: 'Connection not found' })
    }

    const user = await User.findById(userId)
    user.connections.push(id)
    await user.save()

    const toUser = await User.findById(id)
    toUser.connections.push(userId)
    await toUser.save()

    connection.status = 'accepted'
    await connection.save()

    res.json({ success: true, message: 'Connection accepted successfully' })


  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


export const getUserProfiles = async (req, res) => {
  try {
    const { profileId } = req.body
    const profile = await User.findById(profileId)
    if (!profile) {
      return res.json({ success: false, message: 'Profile not found' })
    }
    const posts = await Post.find({ user: profileId }).populate('user')

    res.json({ success: true, profile, posts })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}