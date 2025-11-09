import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Story from '../models/Story.js';
import User from '../models/User.js';
import { inngest } from '../inngest/index.js';


const getUserIdFromReq = async (req) => {
    if (req.userId) return req.userId;
    if (typeof req.auth === 'function') {
        const ad = await req.auth();
        return ad?.userId || ad?.user_id || ad?.sub;
    }
    return req.auth?.userId || req.auth?.user_id || req.auth?.sub;
}

//add story
export const addUserStory=async(req, res)=>{
    try {
        const userId = await getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const {content, media_type, background_colour}=req.body
        const media=req.file
        let media_url=''

        if(media_type==='image' || media_type==='video'){
            const fileBuffer=fs.readFileSync(media.path)
            const response=await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            })
            media_url=response.url
        }
        const story=await Story.create({
            user: userId, 
            content,
            media_url,
            media_type,
            background_colour
        })

        await inngest.send({
            name: 'app/story.delete',
            data: {storyId: story._id}
        })

        res.json({success: true})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//get stories of other users
export const getStories=async(req, res)=>{
    try {
        const userId = await getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const user=await User.findById(userId)

        const userIds=[userId, ...user.connections, ...user.following]

        const stories=await Story.find({
            user: {$in: userIds}
        }).populate('user').sort({createdAt: -1})

        res.json({success: true, stories})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}