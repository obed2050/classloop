# 🎓 SchoolGram Backend

A production-ready backend for a school social media platform focused on nostalgic memories, reels, and real-time student interaction.

## 🚀 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v4
- **Database**: MySQL 8+ with mysql2
- **Auth**: JWT + bcryptjs + HTTP-only cookies
- **Real-time**: Socket.IO v4
- **Media**: Cloudinary + Multer
- **Security**: Helmet, express-rate-limit, CORS
- **Logging**: Winston + Morgan
- **Validation**: express-validator

---

## 📁 Project Structure

```
src/
├── config/
│   ├── db.js              # MySQL connection pool
│   ├── cloudinary.js      # Cloudinary config
│   └── initDb.js          # Database schema initialization
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── reelController.js
│   ├── commentController.js
│   ├── chatController.js
│   ├── notificationController.js
│   ├── memoryController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Centralized error handling
│   ├── upload.js          # Multer file handling
│   └── validate.js        # Validation middleware
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── postRoutes.js
│   ├── reelRoutes.js
│   ├── commentRoutes.js
│   ├── chatRoutes.js
│   ├── notificationRoutes.js
│   ├── memoryRoutes.js
│   └── adminRoutes.js
├── services/
│   └── cloudinaryService.js
├── sockets/
│   └── socketHandler.js   # Socket.IO events
├── utils/
│   ├── logger.js
│   ├── apiResponse.js
│   ├── jwt.js
│   └── helpers.js
├── validations/
│   └── index.js
├── uploads/               # Temp storage (auto-cleared)
├── app.js                 # Express app setup
└── server.js              # HTTP + Socket.IO server
```

---

## ⚙️ Setup & Installation

### 1. Clone and install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Create MySQL database
```sql
CREATE DATABASE schoolgram CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Initialize database tables
```bash
npm run db:init
```

### 5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | `schoolgram` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/users/suggested` | Suggested users |
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/profile/update` | Update profile |
| POST | `/api/users/profile/avatar` | Upload avatar |
| POST | `/api/users/:userId/follow` | Follow/unfollow |
| GET | `/api/users/:userId/followers` | Get followers |
| GET | `/api/users/:userId/following` | Get following |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts/feed` | Personalized feed |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/:id` | Get post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like/unlike |
| POST | `/api/posts/:id/save` | Save/unsave |
| GET | `/api/posts/saved` | Saved posts |
| GET | `/api/posts/search?q=` | Search posts |
| GET | `/api/posts/user/:userId` | User's posts |

### Reels
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reels` | All reels |
| GET | `/api/reels/trending` | Trending reels |
| POST | `/api/reels` | Upload reel |
| GET | `/api/reels/:id` | Get reel |
| DELETE | `/api/reels/:id` | Delete reel |
| POST | `/api/reels/:id/like` | Like/unlike reel |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/comments?target_id=&target_type=` | Get comments |
| POST | `/api/comments` | Add comment/reply |
| DELETE | `/api/comments/:id` | Delete comment |
| POST | `/api/comments/:id/like` | Like comment |
| GET | `/api/comments/:commentId/replies` | Get replies |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat/conversations` | My conversations |
| POST | `/api/chat/conversations` | Start DM |
| POST | `/api/chat/conversations/group` | Create group |
| GET | `/api/chat/conversations/:id/messages` | Get messages |
| POST | `/api/chat/conversations/:id/messages` | Send message |
| DELETE | `/api/chat/messages/:id` | Delete message |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/read-all` | Mark all read |
| PUT | `/api/notifications/:id/read` | Mark one read |

### Memories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/memories` | Get memories |
| POST | `/api/memories` | Create memory |
| GET | `/api/memories/timeline/:userId` | Memory timeline |
| DELETE | `/api/memories/:id` | Delete memory |
| POST | `/api/memories/:id/like` | Like memory |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Stats |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:userId/ban` | Ban user |
| PUT | `/api/admin/users/:userId/unban` | Unban user |
| DELETE | `/api/admin/posts/:postId` | Remove post |

---

## 🔌 Socket.IO Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `conversation:join` | `conversationId` | Join chat room |
| `conversation:leave` | `conversationId` | Leave chat room |
| `message:send` | `{ conversationId, content, mediaUrl, mediaType }` | Send message |
| `typing:start` | `{ conversationId }` | Start typing |
| `typing:stop` | `{ conversationId }` | Stop typing |
| `status:get` | `{ userIds: [] }` | Check online status |
| `notification:read` | `{ notificationId }` | Mark notification read |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `message:new` | Message object | New message received |
| `typing:start` | `{ userId, username, conversationId }` | User typing |
| `typing:stop` | `{ userId, conversationId }` | User stopped typing |
| `user:online` | `{ userId, username }` | User came online |
| `user:offline` | `{ userId }` | User went offline |
| `status:response` | `{ userId: boolean }` | Online status map |
| `notification:new` | Notification object | New notification |

### Socket Authentication
```js
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token' }
});
```

---

## 🗄️ Database Schema

### Tables
- `users` - User accounts with profile data
- `follows` - Follow relationships
- `posts` - Photo/video posts with memory support
- `reels` - Short vertical videos
- `likes` - Polymorphic likes (posts, reels, comments)
- `saved_posts` - Bookmarked posts
- `comments` - Nested comments with replies
- `conversations` - DM and group chats
- `conversation_participants` - Chat members
- `messages` - Chat messages
- `notifications` - Activity notifications
- `memories` - Throwback/nostalgic content

---

## 🛡️ Security Features

- JWT tokens stored in HTTP-only cookies
- bcryptjs password hashing (cost factor 12)
- Helmet.js security headers
- Rate limiting (100 req/15min global, 10 req/15min auth)
- Input validation on all endpoints
- SQL injection prevention via parameterized queries
- CORS with whitelist
- Admin role authorization

---

## 📊 Feed Algorithm

The personalized feed prioritizes:
1. Posts from followed users (highest priority)
2. Posts with 10+ likes (popular content)
3. Memory/throwback posts (nostalgic content)
4. Sorted by likes count then recency

---

## 🎬 Memory Types

- `throwback` - Old school photos
- `before_after` - Then vs now comparisons
- `funny_moment` - Hilarious school moments
- `school_event` - Events and activities
- `graduation` - Graduation memories
