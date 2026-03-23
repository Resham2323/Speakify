import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },// exclude current user
                { _id: { $nin: currentUser.friends } },//exclude friends for recommendation
                { isOnboarded: true }
            ]
        });
        res.status(200).json(recommendedUsers);

    } catch (err) {
        console.log("error in recommending friend request", err.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("friends").
            populate("friends", "fullName profilePic nativeLanguage learningLanguage")

        res.status(200).json(user.friends);
    } catch (err) {
        console.log("error in get my friend request", err.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteFriend = async (req, res) => {
    try {
        console.log(req.params)
        const { friendId } = req.params;
        const userId = req.user.id;

       const friend = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { returnDocument: "after" }
        )

        if (!friend) {
            return res.status(404).json({ message: 'friend not found' })
        }

        res.status(200).json({
            message: 'friend deleted successfully...'
        })
    } catch (error) {
        console.log("error in get my friend request", error);
       return  res.status(500).json({ message: "Internal server error", error:error.message })
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) {
            return res.status(401).json({ message: "user cannot sent friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(401).json({ message: "recipient not found" })
        }

        // check if user is already a friend
        if (recipient.friends.includes(myId)) {
            return res.status(401).json({ message: "you are already friend with this user" })
        }

        // check if user already exist 
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        })

        if (existingRequest) {
            return res.status(401).json({ message: "request already exist" })
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })


        res.status(201).json(friendRequest)
    } catch (err) {
        console.log("error in getFriendRequest", err.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const acceptRequest = async (req, res) => {
    try {
        const { id: recipentId } = req.params;

        const friendRequest = await FriendRequest.findById(recipentId)
        if (!friendRequest) {
            return res.status(401).json({ message: "request not found" })
        }

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(401).json({ message: "you are not authorized to accept this request" })
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each user to thr other friends array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        })

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        })

        res.status(200).json({ message: "Friend request accepted" })
    } catch (err) {
        console.log("error in accepting friend request", err)
        res.status(500).json({ message: "Internal error" })
    }

}

export const rejectRequest = async (req, res) => {
  try {

    const { id: requestId } = req.params

    const friendRequest = await FriendRequest.findById(requestId)

    if (!friendRequest) {
      return res.status(404).json({ message: "request not found" })
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(401).json({
        message: "you are not authorized to reject this request"
      })
    }

    friendRequest.status = "rejected"
    await friendRequest.save()

    res.status(200).json({
      message: "friend request rejected"
    })

  } catch (err) {

    console.log("Error in rejecting friend request", err)

    res.status(500).json({
      message: "internal server error"
    })
  }
}
export const getFriendRequest = async (req, res) => {
    try {
        const incomingRequest = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName nativeLanguage learningLanguage profilePic")

        const acceptRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic")

        console.log("accepted request")
        res.status(200).json({ incomingRequest, acceptRequest });
    } catch (err) {
        console.log("error in getting friend request", err),
            res.status(500).json({ message: "Internal server error" })
    }
}

export const getOutGoingFriendRequest = async (req, res) => {
    try {
        const outGoingRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("sender", "fullName nativeLanguage learningLanguage profilePic")

        res.status(200).json(outGoingRequest);
    } catch (err) {
        console.log("error in getting getOutGoingFriendRequest", err),
            res.status(500).json({ message: "Internal server error" })
    }
} 