import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Comment } from "../types/Comment";
import * as commentModel from "../models/comment";
var jsonParser = bodyParser.json();
const commentRouter = express.Router();

commentRouter.post("/", jsonParser, async (req: Request, res: Response) => {
  console.log("Request Body:", req.body);
  console.log("Files:", req.files); // Log files if any (assuming you're using multer or similar)

  // Extract new comment from req.body
  const newComment: Comment = req.body;

  console.log(newComment);
  // Validate required fields
  if (!newComment.text || !newComment.post_id || !newComment.user_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Call the model to add the comment
  commentModel.addComment(newComment, (err, insertId) => {
    if (err) {
      // Log the error for debugging
      console.error("Error adding comment:", err);
      return res.status(500).json({ message: err.message });
    }

    // If successful, return a success message
    return res.status(200).json({
      message: "Datele au fost introduse cu succes",
      insertId: insertId, // Optionally return the new comment ID
    });
  });
});

commentRouter.get("/:post_id", async (req: Request, res: Response) => {
  const postid = parseInt(req.params.post_id, 10); // Make sure post_id is a number

  if (isNaN(postid)) {
    return res.status(400).json({ errorMessage: "Invalid post_id" });
  }

  commentModel.findAll(postid, (err, comments) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    return res.status(200).json({ data: comments });
  });
});

export { commentRouter };
