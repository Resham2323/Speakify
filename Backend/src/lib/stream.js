import {StreamChat} from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret) {
    console.error("stream api key or secret missing ")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upstreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData])
        return userData;
    } catch (err) {
        console.error("error upserting userdata on stream", err);
    }
}

export const generateStreamToken = (userId) => {
    try {
        // ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (err) {
        console.log("error in generating stream token", err.message)
        res.status(500).json({message:"Interval server error.."})
    }
}