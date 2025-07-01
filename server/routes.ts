import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema, insertStorySchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
