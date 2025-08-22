# German Word Learning App

A modern web application for building and managing your German vocabulary collection.

## Features

### Word Management
- **Add Words**: Comprehensive form with all essential German word information
  - German Word Singular (required)
  - German Word Plural
  - Article (der, die, das) - required
  - Topic (required)
  - Image upload
  - Language Level (A1-C2)
  - English translation
  - English description
  - Jeopardy-style question
  - Clues (array)
  - Synonyms (array)
  - Further characteristics (array)

### User Interface
- **Home**: Browse all German words in a beautiful grid layout
- **My Words**: Manage your personal vocabulary collection
- **Search**: Advanced filtering by word, level, topic
- **Profile**: View user statistics and word collections
- **Authentication**: Secure login/signup system

### Technical Features
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-time Filtering**: Instant search and filter results
- **Image Upload**: Cloudinary integration for word images
- **Modern UI**: Clean, intuitive design with Tailwind CSS
- **Form Validation**: Comprehensive input validation
- **Toast Notifications**: User-friendly feedback system

## Tech Stack

### Frontend
- **Vite + React**: Fast development and optimized builds
- **Redux Toolkit**: State management with persistence
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **Sonner**: Toast notifications

### Backend
- **Express.js**: Web framework
- **MongoDB + Mongoose**: Database and ODM
- **JWT**: Authentication
- **Cloudinary**: Image storage
- **Multer**: File upload handling
- **bcryptjs**: Password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gamedev
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   URL=http://localhost:5173
   ```

5. **Run the application**
   
   Development mode (separate terminals):
   ```bash
   # Backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend
   npm run dev
   ```

   Production build:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/logout` - User logout
- `GET /api/v1/user/profile/:id` - Get user profile

### Words
- `POST /api/v1/word/add` - Add new word
- `GET /api/v1/word/all` - Get all words
- `GET /api/v1/word/user` - Get user's words
- `GET /api/v1/word/search` - Search words
- `PUT /api/v1/word/:id` - Update word
- `DELETE /api/v1/word/:id` - Delete word

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required),
  profilePicture: String,
  bio: String,
  gender: String,
  followers: [ObjectId],
  following: [ObjectId],
  words: [ObjectId],
  bookmarks: [ObjectId]
}
```

### Word Model
```javascript
{
  germanWordSingular: String (required),
  germanWordPlural: String,
  article: String (required, enum: ['der', 'die', 'das']),
  topic: String (required),
  image: String,
  languageLevel: String (enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  englishTranslation: String,
  englishDescription: String,
  jeopardyQuestion: String,
  clues: [String],
  synonyms: [String],
  furtherCharacteristics: [String],
  author: ObjectId (required)
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built with modern React and Node.js best practices
- UI components from Radix UI and Tailwind CSS
- Icons from Lucide React
- Image storage powered by Cloudinary