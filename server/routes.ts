import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema, insertStorySchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all posts with user info and comments
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Create a new post
  app.post("/api/posts", async (req, res) => {
    try {
      const result = insertPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid post data" });
      }
      
      const post = await storage.createPost(result.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Create a new comment
  app.post("/api/comments", async (req, res) => {
    try {
      const result = insertCommentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid comment data" });
      }
      
      const comment = await storage.createComment(result.data);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Get all stories with user info
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  // Create a new story
  app.post("/api/stories", async (req, res) => {
    try {
      const result = insertStorySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid story data" });
      }
      
      const story = await storage.createStory(result.data);
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Failed to create story" });
    }
  });

  // Upload image
  app.post("/api/upload", upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadDir));

  // Like/unlike a post
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const result = await storage.togglePostLike(postId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ error: "Failed to toggle like" });
    }
  });

  // Share a post
  app.post("/api/posts/:id/share", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const result = await storage.sharePost(postId);
      res.json(result);
    } catch (error) {
      console.error("Error sharing post:", error);
      res.status(500).json({ error: "Failed to share post" });
    }
  });

  // Follow a user
  app.post("/api/users/:id/follow", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const result = await storage.followUser(userId);
      res.json(result);
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ error: "Failed to follow user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
