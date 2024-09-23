import express, { Request, Response } from "express";
import * as bodyParser from "body-parser";
import fileUpload, { UploadedFile } from "express-fileupload";
import path from "path";
import * as postModel from "../models/post";
import { Post } from "../types/Post";
const postRouter = express.Router();
var jsonParser = bodyParser.json();

postRouter.get("/", async (req: Request, res: Response) => {
  postModel.findAll((err: Error, posts: Post[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: posts });
  });
});
postRouter.get("/last3", async (req: Request, res: Response) => {
  postModel.findLast3((err: Error, posts: Post[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: posts });
  });
});
postRouter.get("/categories", async (req: Request, res: Response) => {
  postModel.findAllCategories((err: Error, posts: Post[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: posts });
  });
});

postRouter.get("/:id", async (req: Request, res: Response) => {
  const postId: number = Number(req.params.id);
  postModel.findOne(postId, (err: Error, post: Post) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ data: post });
  });
});

postRouter.post("/", jsonParser, async (req: Request, res: Response) => {
  console.log(req.body);
  console.log("files", req.files);
  const newPost: Post = req.body;

  let fileToUpload: any;
  let uploadPath;
  fileToUpload = req.files!.poza as UploadedFile; //Object is possibly 'null' or 'undefined'.
  const newFileName = `${Date.now()}_${fileToUpload.name}`;
  uploadPath = path.join(__dirname, "..", "/uploads/", newFileName);

  console.log(uploadPath);
  fileToUpload.mv(uploadPath);
  newPost["poza"] = newFileName;
  console.log(newPost);
  postModel.addPost(newPost, (err: Error, postId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res
      .status(200)
      .json({ message: "Datele au fost introduse cu succes" });
  });
});

// Delete Post
postRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id, 10); // Get the post ID from the URL parameter
  console.log(postId);

  if (isNaN(postId)) {
    return res.status(400).json({ errorMessage: "Invalid post ID" }); // Validate the ID
  }

  // Call the delete function from the postModel
  postModel.deletePost(postId, (err: Error, result: any) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message }); // Handle any server errors
    }

    // Send the result from delete operation (success or not found)
    return res.status(200).json(result);
  });
});

// Edit post
postRouter.put("/:id", async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id, 10); // Get the post ID from the URL parameter

  if (isNaN(postId)) {
    return res.status(400).json({ errorMessage: "Invalid post ID" }); // Validate the ID
  }

  const formData = req.body; // Get title and content from the request body
  console.log(formData);
  // Validate input (ensure at least one field is being updated)
  if (!formData) {
    return res
      .status(400)
      .json({ errorMessage: "No fields provided to update" });
  }

  // Create the updated data object
  const updatedData: { title?: string; content?: string } = {};
  if (formData.titlu) updatedData.title = formData.titlu;
  if (formData.continut) updatedData.content = formData.continut;

  // Call the editPost function from postModel
  postModel.editPost(postId, updatedData, (err: Error, result: any) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message }); // Handle any server errors
    }

    // Send the result from the update operation (success or not found)
    return res.status(200).json(result);
  });
});

export { postRouter };
