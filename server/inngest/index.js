import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodemailer.js";
import Story from "../models/Story.js";
import { useId } from "react"; 

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Glitch-app" });

const syncUserCreation=inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk.user.created'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url}=event.data
        let username=email_addresses[0].email_address.split('@')[0]

        const user=await User.findOne({username})

        if(user){
            username=username + Math.floor(Math.random()*10000)
        }
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
            username
        }
        await User.create(userData)
    }
)

const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk.user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        const updatedUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
        }

        
        const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, { new: true })
        if (!updatedUser) {
            console.error(`User update failed: ID ${id} not found.`);
            
            throw new Error(`User with ID ${id} not found for update.`);
        }
        return { message: `User ${id} updated successfully.` };
    }
)

const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk.user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDelete(id)
    }
)

const sendNewConnectionRequestReminder = inngest.createFunction(
    { id: 'send-new-connection-request-reminder' },
    { event: "app/connection-request" },
    async ({ event, step }) => {
        const { connectionId } = event.data

        await step.run('send-connection-request-mail', async () => {
            const connection = await Connection.findById(connectionId).populate('from-user-id to-user-id')
            const subject = `Hey there! New connection request`
            const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hi ${connection.to_user_id.full_name},</h2>
                <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
                <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #5310b9;">here</a> to view the request</p>
                <br>
                <p>Thanks,<br>Glitch - Connect. Share. Discover</p>
            </div>`;

            await sendEmail({
                to: connection.to_user_id.email,
                subject, 
                body,
            })
        })

        const in24Hours = new Date(Date.now() + 24*60*60*1000)
        await step.sleepUntil("wait-for-24-hours", in24Hours)
        await step.run('send-connection-request-reminder', async () => {
            const connection=await Connection.findById(connectionId).populate('from_user_id to_user_id')

            if(connection.status==='accepted'){
                return {message: 'Connection already accepted'}
            }

            const subject = `Hey there! New connection request`
            const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hi ${connection.to_user_id.full_name},</h2>
                <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
                <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #5310b9;">here</a> to view the request</p>
                <br>
                <p>Thanks,<br>Glitch - Connect. Share. Discover</p>
            </div>`;

            await sendEmail({
                to: connection.to_user_id.email,
                subject, 
                body,
            })
            return {message: 'Reminder sent'}

        })
    }
)

const deleteStory=inngest.createFunction(
    {id: 'story-delete'},
    {event: 'app/story.delete'},
    async ({event, step}) => {
        const {storyId}=event.data
        const in24Hours = new Date(Date.now() + 24*60*60*1000)
        await step.sleepUntil('wait-for-24-hours', in24Hours)
        await step.run("delete-story", async()=>{
            await Story.findByIdAndDelete(storyId)
            return {message: 'Story deleted'}
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequestReminder,
    deleteStory
];