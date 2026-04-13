# STARFIELDS Platform

A comprehensive full-stack web application for Real Estate, Hotel & Resort Booking, Restaurants, and Travel & Tours in the Philippines.

![STARFIELDS Logo](https://via.placeholder.com/150x150/0ea5e9/ffffff?text=S)

## 🌟 Features

### 🏠 Real Estate Module
- **User Authentication**: Multi-role support (Buyer, Seller, Agent, Admin)
- **Property Listings**: Browse, search, and filter properties
- **Advanced Search**: Filter by location, price, bedrooms, bathrooms, property type
- **Property Details**: Full property information with images, maps, and reviews
- **Favorites**: Save properties to wishlist
- **Agent Contact**: Direct contact with property agents
- **Location Directory**: Luzon / Visayas / Mindanao regions with Province → City → Barangay hierarchy

### 🏨 Hotel & Resort Module
- **Booking System**: Book hotel rooms with date selection
- **Room Availability**: Real-time room availability checking
- **Hotel Search**: Filter by location, star rating, price
- **Hotel Details**: Amenities, photos, location map

### 🍽 Restaurants Module (Coming Soon)
- Restaurant listings and search
- Table reservation system
- Menu preview

### ✈️ Travel & Tours Module (Coming Soon)
- Tour packages booking
- Transport booking (van, car, bus)
- Travel itinerary builder

### 👥 Agent Network System
- **Hierarchy Structure**: Property Manager → Unit Managers → Licensed Agents
- **Dashboard**: Individual dashboards per role
- **Lead Management**: Assign and track leads
- **Commission Tracking**: Track agent commissions
- **Performance Metrics**: View sales and activity stats

### 🛠 Services Module
- Buy / Sell / Rent / Mortgage services
- Titling / Survey / Transfer assistance
- Home Loan Assistance
- Construction Services

### 🗺 Global Map Feature
- Interactive map integration using Leaflet
- Property location markers
- Filter listings on map view

### 🔐 Security & System
- JWT-based authentication with refresh tokens
- Role-based access control
- Secure password hashing with bcrypt
- Rate limiting and security headers

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Security**: helmet, express-rate-limit

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Leaflet + React-Leaflet
- **HTTP Client**: Axios
- **Date Picker**: react-datepicker
- **Query Management**: React Query

## 📁 Project Structure

```
starfields/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── propertyController.js
│   │   ├── hotelController.js
│   │   ├── userController.js
│   │   └── locationController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── migrations/             # Database schema files
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_otp_tokens.sql
│   │   ├── 003_create_locations.sql
│   │   ├── 004_create_properties.sql
│   │   ├── 005_create_property_media.sql
│   │   ├── 006_create_hotels.sql
│   │   ├── 007_create_restaurants.sql
│   │   ├── 008_create_travel.sql
│   │   ├── 009_create_chat_system.sql
│   │   ├── 010_create_agent_network.sql
│   │   ├── 011_create_services.sql
│   │   ├── 012_create_notifications.sql
│   │   └── 013_create_admin_tables.sql
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── hotels.js
│   │   ├── users.js
│   │   ├── locations.js
│   │   ├── restaurants.js
│   │   ├── travel.js
│   │   ├── agents.js
│   │   ├── chat.js
│   │   ├── services.js
│   │   ├── bookings.js
│   │   ├── documents.js
│   │   └── admin.js
│   ├── seeds/
│   │   └── run.js              # Database seeding
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Main entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── ProtectedRoute.js
│   │   ├── layouts/
│   │   │   ├── MainLayout.js
│   │   │   └── DashboardLayout.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── RealEstate.js
│   │   │   ├── PropertyDetail.js
│   │   │   ├── Hotels.js
│   │   │   ├── HotelDetail.js
│   │   │   ├── Restaurants.js
│   │   │   ├── Travel.js
│   │   │   ├── Services.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── MyProperties.js
│   │   │   ├── Favorites.js
│   │   │   ├── Bookings.js
│   │   │   ├── AgentDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── store/
│   │   │   └── authStore.js    # Zustand auth store
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starfields_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key
```

5. Create PostgreSQL database:
```sql
CREATE DATABASE starfields_db;
```

6. Run migrations:
```bash
npm run migrate
```

7. Seed the database:
```bash
npm run seed
```

8. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## 🔑 Default Admin Credentials

After running the seeds, you can log in with:
- **Email**: admin@starfields.com.ph
- **Password**: admin123

(Change these in production!)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/password` - Change password

### Properties
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (auth)
- `PUT /api/properties/:id` - Update property (auth)
- `DELETE /api/properties/:id` - Delete property (auth)
- `POST /api/properties/:id/favorite` - Toggle favorite (auth)
- `POST /api/properties/:id/reviews` - Add review (auth)

### Hotels
- `GET /api/hotels` - List hotels
- `GET /api/hotels/:id` - Get hotel details
- `GET /api/hotels/:id/availability` - Check room availability
- `POST /api/hotels/bookings` - Create booking (auth)
- `GET /api/hotels/bookings/my` - Get user bookings (auth)

### Locations
- `GET /api/locations/regions` - Get all regions
- `GET /api/locations/regions/:regionId/provinces` - Get provinces
- `GET /api/locations/provinces/:provinceId/cities` - Get cities
- `GET /api/locations/cities/:cityId/barangays` - Get barangays
- `GET /api/locations/hierarchy` - Get full hierarchy
- `GET /api/locations/search` - Search locations

### Users
- `GET /api/users/favorites` - Get favorites (auth)
- `GET /api/users/properties` - Get my properties (auth)
- `GET /api/users/stats` - Get user stats (auth)
- `POST /api/users/avatar` - Upload avatar (auth)

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (10 rounds)
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- SQL injection protection via parameterized queries

## 🎨 UI/UX Features

- Modern, responsive design with Tailwind CSS
- Mobile-first approach
- Clean navigation with intuitive user flows
- Role-based dashboard interfaces
- Interactive maps with Leaflet
- Loading states and error handling
- Toast notifications (ready for implementation)

## 🚧 Future Enhancements

- Real-time chat system (Socket.io foundation ready)
- Payment gateway integration
- Email notifications with nodemailer
- Push notifications
- Advanced analytics dashboard
- Mobile app (React Native)
- AI-powered property recommendations
- Virtual property tours
- Multi-language support

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For inquiries, please contact: info@starfields.com.ph

---

Built with ❤️ for the Philippines
