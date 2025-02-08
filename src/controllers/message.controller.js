import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js"
//this fetches list of user from sidebar
export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); //so we filter to not fetch user-profile
        
        res.status(200).json({filteredUsers})

    } catch (error) {
        console.log("Error while getting user from sidebar", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

//now fetch the chat w/ clicked user
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in fetching messages", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

//to send (text, image)
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();
        //todo: realtime functionality using socket.io
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in send message controller", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}
