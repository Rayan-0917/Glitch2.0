import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Message from '../models/Message.js';

const getUserIdFromReq = async (req) => {
    if (req.userId) return req.userId;
    if (typeof req.auth === 'function') {
        const ad = await req.auth();
        return ad?.userId || ad?.user_id || ad?.sub;
    }
    return req.auth?.userId || req.auth?.user_id || req.auth?.sub;
}

//empty object to store server side event connections
const connections = {}

//function for SSE endpoint
export const sseController = (req, res) => {
    const {userId} = req.params
    console.log('New client connected: ', userId)

    //set SSE headers
    res.setHeader('Content-type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    connections[userId] = res

    res.write('log: Connected to SSE stream\n\n')

    //disconnect
    req.on('close', () => {
        delete connections[userId]
        console.log('Client disconnected')
    })

}

//send message

export const sendMessage = async (req, res) => {
    try {
        const userId = await getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { to_user_id, text } = req.body
        const image = req.file

        let media_url = ''
        let message_type = image ? 'image' : 'text'

        if (message_type === 'image') {
            const fileBuffer = fs.readFileSync(image.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname
            })
            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type, media_url
        })

        res.json({ success: true, message })

        const messageWithUserData = await Message.findById(message._id).populate('from_user_id')

        if (messageWithUserData?.from_user_id && messageWithUserData?.to_user_id) {
            // Send to recipient
            if (connections[to_user_id]) {
                connections[to_user_id].write(
                    `data: ${JSON.stringify(messageWithUserData)}\n\n`
                )
            }
            // Send to sender
            if (connections[userId]) {
                connections[userId].write(
                    `data: ${JSON.stringify(messageWithUserData)}\n\n`
                )
            }
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//get chat messages
export const getChatMessages = async (req, res) => {
    try {
        const userId = await getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { to_user_id } = req.body

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId },
            ]
        }).sort({ createdAt: -1 })

        await Message.updateMany({ from_user_id: to_user_id, to_user_id: userId }, { seen: true })

        res.json({ success: true, messages })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//get recent messsages
export const getUserRecentMessages = async (req, res) => {
    try {
        const userId = await getUserIdFromReq(req);
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const messages = await Message.find({ to_user_id: userId }).populate('from_user_id to_user_id').sort({ createdAt: -1 })

        res.json({ success: true, messages })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}