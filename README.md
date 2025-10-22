# Wellness IV Drip - Mobile IV Vitamin Therapy Service

A modern, responsive Next.js website for Wellness IV Drip, a mobile IV vitamin therapy service in Canberra, Australia. This website features a comprehensive booking system, admin dashboard, and beautiful design inspired by IV League Drips.

## Features

### Frontend

- **Modern Design**: Sleek, responsive design with video background hero section
- **Service Pages**: Comprehensive service listings with collapsible sections
- **Booking System**: Interactive calendar and time slot selection
- **About & Contact**: Detailed information about the company and team
- **Steps Navigation**: Visual progress indicator for the booking process
- **Mobile Responsive**: Optimized for all device sizes

### Backend

- **SQLite Database**: Lightweight database for storing bookings and admin data
- **JWT Authentication**: Secure admin login system
- **RESTful API**: Complete API for booking management
- **Admin Dashboard**: Full booking management interface

### Admin Features

- **Login System**: Secure authentication with JWT tokens
- **Booking Management**: View, update, and manage all appointments
- **Status Updates**: Change booking status (pending, confirmed, completed, cancelled)
- **Statistics Dashboard**: Overview of booking statistics

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT with bcryptjs
- **Calendar**: React Calendar
- **Icons**: Lucide React
- **Fonts**: Inter & Playfair Display

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd wellness-iv-drip
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials in production!

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── bookings/     # Booking management endpoints
│   ├── admin/            # Admin dashboard
│   ├── booking/          # Booking page
│   ├── services/         # Services page
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   └── page.tsx          # Homepage
├── components/            # Reusable components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   └── StepsNavigation.tsx # Booking steps indicator
└── lib/                  # Utility libraries
    ├── database.ts       # Database connection
    └── auth.ts           # Authentication utilities
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify admin token

### Bookings

- `GET /api/bookings` - Get all bookings (admin only)
- `POST /api/bookings` - Update booking status (admin only)
- `POST /api/bookings/create` - Create new booking

## Database Schema

### Bookings Table

- `id` - Primary key
- `name` - Customer name
- `email` - Customer email
- `phone` - Customer phone
- `service` - Selected service ID
- `date` - Appointment date
- `time` - Appointment time
- `message` - Additional message
- `status` - Booking status (pending, confirmed, completed, cancelled)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Admins Table

- `id` - Primary key
- `username` - Admin username
- `password` - Hashed password
- `created_at` - Creation timestamp

## Services Offered

1. **Hydration Therapy** - $120 (30-45 min)
2. **Energy Boost** - $150 (45-60 min)
3. **Immunity Support** - $180 (45-60 min)
4. **Beauty Glow** - $200 (60 min)
5. **Athletic Recovery** - $220 (60-75 min)
6. **Premium Wellness** - $280 (75-90 min)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

- Ensure Node.js 18+ support
- Set up environment variables
- Configure database persistence (consider PostgreSQL for production)

## Customization

### Colors

The site uses a teal and amber color scheme. Update `tailwind.config.ts` to change colors:

```typescript
colors: {
  teal: { /* your teal colors */ },
  amber: { /* your amber colors */ }
}
```

### Services

Update the services array in `/src/app/services/page.tsx` to modify available services.

### Contact Information

Update contact details in `/src/components/Footer.tsx` and `/src/app/contact/page.tsx`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, contact:

- **Phone**: 0450 480 698
- **Email**: admin@wellnessivdrip.com.au

---

**Developed by Shantanu Goswami**  
© 2025 The Explorer
