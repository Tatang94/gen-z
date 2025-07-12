import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertPostSchema, insertCommentSchema, insertStorySchema } from "@shared/sqlite-schema";
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
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const storage = getStorage();
      
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, displayName, email, password } = req.body;
      const storage = getStorage();
      
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user
      const newUser = await storage.createUser({
        username,
        displayName,
        email,
        password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=150`
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

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

  // Delete user (Admin only)
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const userId = parseInt(req.params.id);
      await storage.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Ban user (Admin only)
  app.post("/api/users/:id/ban", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const userId = parseInt(req.params.id);
      await storage.banUser(userId);
      res.status(200).json({ message: "User banned successfully" });
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ error: "Failed to ban user" });
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
      
      console.log("Request body:", req.body);
      console.log("Storage type:", storage.constructor.name);
      
      const result = insertPostSchema.safeParse(req.body);
      if (!result.success) {
        console.log("Validation error:", result.error);
        return res.status(400).json({ error: "Invalid post data", details: result.error.issues });
      }
      
      console.log("Creating post with data:", result.data);
      const post = await storage.createPost(result.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Delete a post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const postId = parseInt(req.params.id);
      await storage.deletePost(postId);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
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

  // Chat API endpoints
  app.get("/api/chat/conversations", async (req, res) => {
    try {
      // Mock chat users data
      const chatUsers = [
        {
          id: '1',
          username: 'sarah_chen',
          displayName: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          isOnline: true,
          lastMessage: 'Hai! Gimana kabarnya?',
          lastMessageTime: '2025-07-12T10:30:00Z',
          unreadCount: 0
        },
        {
          id: '2',
          username: 'alex_dev',
          displayName: 'Alex Rivera',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          isOnline: false,
          lastSeen: '2 jam yang lalu',
          lastMessage: 'Oke, nanti kita diskusi lagi ya',
          lastMessageTime: '2025-07-12T08:15:00Z',
          unreadCount: 2
        },
        {
          id: '3',
          username: 'luna_photo',
          displayName: 'Luna Martinez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          isOnline: true,
          lastMessage: 'Foto kemarin bagus banget!',
          lastMessageTime: '2025-07-12T09:45:00Z',
          unreadCount: 1
        }
      ];
      
      res.json(chatUsers);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/chat/messages/:chatId", async (req, res) => {
    try {
      const { chatId } = req.params;
      
      // Mock messages data based on chatId
      const mockMessages = {
        '1': [
          {
            id: '1',
            senderId: '1',
            content: 'Hai! Gimana kabarnya?',
            timestamp: '2025-07-12T10:30:00Z',
            isRead: true
          },
          {
            id: '2',
            senderId: 'current',
            content: 'Baik! Lagi ngapain?',
            timestamp: '2025-07-12T10:31:00Z',
            isRead: true
          },
          {
            id: '3',
            senderId: '1',
            content: 'Lagi kerja nih, project baru 😊',
            timestamp: '2025-07-12T10:32:00Z',
            isRead: false
          }
        ],
        '2': [
          {
            id: '4',
            senderId: '2',
            content: 'Hai, ada waktu ngobrol?',
            timestamp: '2025-07-12T08:10:00Z',
            isRead: true
          },
          {
            id: '5',
            senderId: 'current',
            content: 'Ada, ada apa?',
            timestamp: '2025-07-12T08:12:00Z',
            isRead: true
          },
          {
            id: '6',
            senderId: '2',
            content: 'Mau tanya soal project kemarin',
            timestamp: '2025-07-12T08:13:00Z',
            isRead: false
          },
          {
            id: '7',
            senderId: '2',
            content: 'Oke, nanti kita diskusi lagi ya',
            timestamp: '2025-07-12T08:15:00Z',
            isRead: false
          }
        ],
        '3': [
          {
            id: '8',
            senderId: '3',
            content: 'Foto kemarin bagus banget!',
            timestamp: '2025-07-12T09:45:00Z',
            isRead: false
          }
        ]
      };
      
      const messages = mockMessages[chatId] || [];
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const { chatId, content } = req.body;
      
      if (!chatId || !content) {
        return res.status(400).json({ error: "Chat ID and content are required" });
      }
      
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'current',
        content: content,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

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

  // Create a new story with JSON data
  app.post("/api/stories", async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const { userId, image } = req.body;
      
      console.log("Story request body:", req.body);
      
      if (!userId || !image) {
        return res.status(400).json({ error: "User ID and image are required" });
      }
      
      const result = insertStorySchema.safeParse(req.body);
      if (!result.success) {
        console.log("Story validation error:", result.error);
        return res.status(400).json({ error: "Invalid story data", details: result.error.issues });
      }
      
      const story = await storage.createStory(result.data);
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Failed to create story" });
    }
  });

  // Create a new story with image upload
  app.post("/api/stories/upload", upload.single('image'), async (req, res) => {
    try {
      const storage = getStorage();
      if (!storage) {
        return res.status(500).json({ error: "Storage not initialized" });
      }
      
      const userId = parseInt(req.body.userId);
      if (!userId || !req.file) {
        return res.status(400).json({ error: "User ID and image are required" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      
      const storyData = {
        userId,
        image: imageUrl,
        timestamp: new Date(),
        isViewed: false
      };
      
      const story = await storage.createStory(storyData);
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Failed to create story" });
    }
  });

  const server = createServer(app);
  return server;
}