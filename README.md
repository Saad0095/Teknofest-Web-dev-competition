# Customer Support Ticket Dashboard

A full-stack web application for managing customer support tickets with user authentication, ticket CRUD operations, and real-time statistics.

## Features

### Core Features
- ✅ **User Authentication**: Secure sign-up and login system with JWT tokens
- ✅ **Session Management**: Users stay logged in after page refresh using localStorage
- ✅ **Create Tickets**: Add tickets with Subject, Description, Category, and Priority
- ✅ **Input Validation**: Comprehensive form validation for all ticket fields
- ✅ **Ticket List**: Display tickets in a structured table with filtering
- ✅ **Status Tracking**: Toggle ticket status between Open, In Progress, and Resolved
- ✅ **Edit & Delete**: Modify or remove tickets with confirmation dialogs
- ✅ **Priority Indicators**: Color-coded priorities (Red=High, Yellow=Medium, Green=Low)
- ✅ **Overdue Warnings**: Visual flags for tickets older than 24 hours in Open status
- ✅ **Statistics Header**: Real-time counts of Open, In Progress, and Resolved tickets

### Bonus Features
- ✅ **Filter & Search**: Filter tickets by status with quick action buttons
- ✅ **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- ✅ **Error Handling**: Graceful error handling and user feedback

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Router**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS 4.1.18
- **Icons**: Lucide React 0.562.0
- **HTTP Client**: Axios 1.13.2
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (with Mongoose 9.1.1)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: Bcryptjs 3.0.3
- **CORS**: cors 2.8.5
- **Environment**: dotenv 17.2.3

### DevTools
- **Frontend**: ESLint, Vite
- **Backend**: Nodemon

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── ticketController.js # Ticket CRUD logic
│   ├── middlewares/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Ticket.js          # Ticket schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── ticketRoutes.js    # Ticket endpoints
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example env file
│   ├── package.json
│   └── server.js              # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TicketForm.jsx     # Create/Edit ticket form
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Dashboard
│   │   │   ├── Login.jsx          # Login page
│   │   │   └── Register.jsx       # Register page
│   │   ├── utils/
│   │   │   └── api.js             # API client with interceptors
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```
PORT=3000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tickets (All require authentication)
- `GET /api/tickets` - Get all tickets for the user
- `GET /api/tickets/stats` - Get ticket statistics
- `GET /api/tickets/:id` - Get a single ticket
- `POST /api/tickets` - Create a new ticket
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Ticket
```bash
POST /api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject": "Login Issue",
  "description": "Unable to log into the system",
  "category": "Technical",
  "priority": "High"
}
```

## Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket Schema
```javascript
{
  _id: ObjectId,
  subject: String,
  description: String,
  category: Enum ["Technical", "Billing", "General"],
  priority: Enum ["Low", "Medium", "High"],
  status: Enum ["Open", "In Progress", "Resolved"],
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## Features in Detail

### Authentication Flow
1. User registers with name, email, and password
2. Password is hashed using bcryptjs before storage
3. JWT token is generated upon successful login/registration
4. Token is stored in localStorage for session persistence
5. Token is included in all subsequent API requests via Authorization header
6. User remains logged in after page refresh

### Ticket Lifecycle
1. **Create**: User fills form with validation
2. **Read**: Tickets displayed in dashboard with real-time updates
3. **Update**: Status can be toggled, or ticket details can be edited
4. **Delete**: With confirmation popup to prevent accidental deletion

### Overdue Warning
- Tickets marked as "Open" for more than 24 hours show an overdue warning
- Visual indicator with red icon and text

### Statistics
- Real-time counts update after any ticket operation
- Shows: Total, Open, In Progress, and Resolved counts

## Error Handling

The application handles:
- Network errors gracefully
- Authentication failures with redirects to login
- Form validation errors with specific messages
- Database connection errors
- Empty result sets

## Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Performance Optimizations

- Efficient re-renders with React hooks
- API response caching where appropriate
- Debounced form submissions
- Optimized CSS with Tailwind utility classes

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes requiring authentication
- CORS enabled for frontend communication
- Environment variables for sensitive data

## Future Enhancements

- Dark mode support
- Export tickets to CSV/PDF
- Advanced search and filtering
- Ticket categorization and tagging
- User roles and permissions
- Email notifications
- Attachment uploads
- Ticket assignment to team members
- Activity logs and audit trail

## Testing

(Add test instructions when test suite is implemented)

## Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend Deployment (Heroku/Railway/Render)
```bash
# Add Procfile
# Deploy with environment variables set
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on the GitHub repository.

## Author

Created for Teknofest Web Development Challenge 2026
