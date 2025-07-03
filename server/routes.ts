import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertPostSchema, insertCommentSchema, insertStorySchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { searchMusicTracks } from "./spotify";

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

function getStorage() {
  return (global as any).storage;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      // Mock users data for now since we need proper user endpoint
      const mockUsers = [
        {
          id: "1",
          username: "sarah_chen",
          displayName: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          bio: "UI/UX Designer • Coffee lover ☕",
          followers: 1247,
          following: 892,
          isVerified: true,
          isOnline: true
        },
        {
          id: "2",
          username: "alex_dev",
          displayName: "Alex Rodriguez",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          bio: "Full-stack developer 💻 | Tech enthusiast",
          followers: 856,
          following: 1034,
          isVerified: false,
          isOnline: true
        }
      ];
      
      res.json(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Get all posts with user info and comments
  app.get("/api/posts", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
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
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
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

  // Like a post
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const postId = parseInt(req.params.id);
      const result = await storage.togglePostLike(postId);
      res.json(result);
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  // Share a post
  app.post("/api/posts/:id/share", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
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
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const userId = parseInt(req.params.id);
      const result = await storage.followUser(userId);
      res.json(result);
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ error: "Failed to follow user" });
    }
  });

  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Music search endpoint
  app.get("/api/spotify/search", searchMusicTracks);

  // Get all stories
  app.get("/api/stories", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  // Create a new comment
  app.post("/api/comments", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
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

  // Create a new story
  app.post("/api/stories", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
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

  const server = createServer(app);
  return server;
}