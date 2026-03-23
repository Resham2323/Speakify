import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendFriendRequest, getMyFriends, getRecommendedUsers, acceptRequest, getOutGoingFriendRequest, rejectRequest, getFriendRequest, deleteFriend } from "../controllers/user.controller.js";
const router = Router()

router.use(protectRoute)

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.delete("/friends/:friendId", deleteFriend);
router.get("/friend-request", getFriendRequest);
router.post("/friend-request/:id", sendFriendRequest);
router.post("/friend-request/:id/accept", acceptRequest);
router.post("/friend-request/:id/reject", rejectRequest)
router.get("/outgoing-friend-requests", getOutGoingFriendRequest);



export default router;