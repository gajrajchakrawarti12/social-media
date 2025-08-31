import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const data = await User.aggregate([
            {
                $lookup: {
                    from: "posts", // collection name in MongoDB
                    localField: "_id",
                    foreignField: "userId",
                    as: "posts"
                }
            },
            {
                $project: {
                    username: 1,
                    fullName: 1,
                    CreatedAt: "$createdAt",
                    posts: {
                        $map: {
                            input: "$posts",
                            as: "p",
                            in: {
                                content: "$$p.content",
                                likes: "$$p.likes",
                                comment: "$$p.comments",
                                createdAt: "$$p.createdAt"
                            }
                        }
                    }
                }
            }
        ]);

        // Convert array to object { user1: {...}, user2: {...} }
        const result = {};
        data.forEach((user, index) => {
            result[`user${index + 1}`] = user;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;