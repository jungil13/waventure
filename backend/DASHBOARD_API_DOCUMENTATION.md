# Owner Dashboard API Documentation

This document describes the API endpoints for the Owner Dashboard functionality in the Waventure application.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get Owner Dashboard Data
Get comprehensive dashboard overview data for a specific boat owner.

**Endpoint:** `GET /bookings/owner/:ownerId/dashboard`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner

**Response:**
```json
{
  "totalBoats": 3,
  "totalBookings": 3,
  "avgRating": 4.5,
  "totalReviews": 2,
  "monthlyEarnings": 9500.00,
  "revenueGrowth": 0.0,
  "recentBookings": [
    {
      "id": 2,
      "boat": "BARKO BARKO",
      "customer": "Honey Kate Padilla",
      "date": "2025-08-16",
      "status": "Completed",
      "payment": "COD",
      "amount": 9500.00,
      "boatType": "Speedboat",
      "image": "http://localhost:5000/uploads/boats/1756392357257-Cebu-Boat-Rental.jpg"
    },
    {
      "id": 3,
      "boat": "Inday Baroday Sail",
      "customer": "Mikha Lim",
      "date": "2025-08-30",
      "status": "Pending",
      "payment": "GCash",
      "amount": 4700.00,
      "boatType": null,
      "image": "http://localhost:5000/uploads/boats/1756392433315-activity20_pic03.jpg"
    }
  ]
}
```

### 2. Get Owner Performance Metrics
Get detailed performance metrics for a specific time period.

**Endpoint:** `GET /bookings/owner/:ownerId/performance`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner
- `period` (query parameter, optional): Time period - 'week', 'month', or 'year' (default: 'month')

**Example Request:**
```
GET /bookings/owner/2/performance?period=month
```

**Response:**
```json
{
  "totalBookings": 3,
  "completedBookings": 1,
  "totalRevenue": 9500.00,
  "avgBookingValue": 9500.00,
  "uniqueCustomers": 2,
  "activeBoats": 2,
  "completionRate": "33.3"
}
```

### 3. Get Owner Activity Summary
Get activity summary including today's, week's, pending, and upcoming bookings.

**Endpoint:** `GET /bookings/owner/:ownerId/activity`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner

**Response:**
```json
{
  "todayBookings": 0,
  "weekBookings": 1,
  "pendingBookings": 2,
  "upcomingBookings": 1
}
```

## Data Models

### Dashboard Data
```typescript
interface DashboardData {
  totalBoats: number;
  totalBookings: number;
  avgRating: number;
  totalReviews: number;
  monthlyEarnings: number;
  revenueGrowth: number; // Percentage
  recentBookings: RecentBooking[];
}
```

### Recent Booking
```typescript
interface RecentBooking {
  id: number;
  boat: string;
  customer: string;
  date: string; // YYYY-MM-DD
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  payment: 'GCash' | 'COD';
  amount: number;
  boatType: string | null;
  image: string | null; // Full URL
}
```

### Performance Metrics
```typescript
interface PerformanceMetrics {
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  uniqueCustomers: number;
  activeBoats: number;
  completionRate: string; // Percentage as string
}
```

### Activity Summary
```typescript
interface ActivitySummary {
  todayBookings: number;
  weekBookings: number;
  pendingBookings: number;
  upcomingBookings: number;
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid period. Must be one of: week, month, year"
}
```

### 404 Not Found
```json
{
  "message": "Owner not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to fetch dashboard data",
  "error": "Database connection error"
}
```

## Usage Examples

### Frontend Integration

```javascript
import { dashboardService } from '@/services/dashboardService';

// Get dashboard overview
const dashboardData = await dashboardService.getOwnerDashboardData(ownerId);

// Get performance metrics for different periods
const monthlyMetrics = await dashboardService.getOwnerPerformanceMetrics(ownerId, 'month');
const weeklyMetrics = await dashboardService.getOwnerPerformanceMetrics(ownerId, 'week');
const yearlyMetrics = await dashboardService.getOwnerPerformanceMetrics(ownerId, 'year');

// Get activity summary
const activitySummary = await dashboardService.getOwnerActivitySummary(ownerId);
```

### Axios Direct Usage

```javascript
import axios from 'axios';

// Get dashboard data
const response = await axios.get(`http://localhost:5000/api/bookings/owner/${ownerId}/dashboard`);

// Get performance metrics
const metricsResponse = await axios.get(`http://localhost:5000/api/bookings/owner/${ownerId}/performance`, {
  params: { period: 'month' }
});

// Get activity summary
const activityResponse = await axios.get(`http://localhost:5000/api/bookings/owner/${ownerId}/activity`);
```

## Dashboard Features

### 1. Overview Statistics
- **Total Boats**: Count of all boats owned by the user
- **Total Bookings**: Count of all bookings across all boats
- **Average Rating**: Average rating from customer reviews
- **Monthly Earnings**: Revenue from completed bookings in current month
- **Revenue Growth**: Percentage change from previous month

### 2. Recent Bookings
- Shows the 5 most recent bookings
- Includes boat information, customer details, and booking status
- Displays boat images with fallback to default image
- Shows payment method and booking amount

### 3. Performance Metrics
- **Completion Rate**: Percentage of completed vs total bookings
- **Average Booking Value**: Average revenue per completed booking
- **Unique Customers**: Number of distinct customers
- **Active Boats**: Number of boats with bookings in the period

### 4. Activity Summary
- **Today's Bookings**: Bookings scheduled for today
- **Week's Bookings**: Bookings in the last 7 days
- **Pending Bookings**: Bookings awaiting confirmation
- **Upcoming Bookings**: Bookings in the next 7 days

## Database Schema

The dashboard API uses the following database tables:

### Core Tables:
- **`boats`** - Boat information linked to owners
- **`bookings`** - Booking records with status and payment info
- **`users`** - Customer and owner information
- **`reviews`** - Customer reviews and ratings
- **`boatimages`** - Boat images

### Key Relationships:
- Bookings → Boats → Owners (via owner_id)
- Bookings → Customers (via user_id)
- Reviews → Boats → Owners (via owner_id)
- Boat Images → Boats (via boat_id)

## Performance Considerations

### Caching
- Dashboard data can be cached for 5-10 minutes
- Performance metrics can be cached for 1 hour
- Activity summary should be real-time (no caching)

### Database Optimization
- Index on `owner_id` in boats table
- Index on `booking_date` in bookings table
- Index on `status` in bookings table
- Consider materialized views for complex aggregations

### Query Optimization
- Use LIMIT for recent bookings to avoid large result sets
- Aggregate functions are optimized for dashboard metrics
- Date filtering uses efficient MySQL date functions

## Security Notes

1. **Authentication Required**: All endpoints require valid JWT token
2. **Owner Authorization**: Users can only access their own dashboard data
3. **Data Validation**: All input parameters are validated
4. **SQL Injection Protection**: All queries use parameterized statements
5. **Rate Limiting**: Consider implementing rate limiting for dashboard endpoints

## Real-time Updates

For real-time dashboard updates, consider implementing:

1. **WebSocket Connection**: For live booking updates
2. **Server-Sent Events**: For periodic data refreshes
3. **Polling**: Simple periodic API calls (current implementation)
4. **Push Notifications**: For important events (new bookings, cancellations)

## Notes

1. **Image URLs**: All image URLs are absolute URLs with server prefix
2. **Currency**: All amounts are in Philippine Peso (₱)
3. **Timezone**: All dates are stored and returned in UTC
4. **Growth Calculations**: Growth percentages are calculated compared to previous period
5. **Rating Display**: Ratings are displayed with 1 decimal place
6. **Fallback Data**: Mock data is provided for development/testing
7. **Error Handling**: Comprehensive error handling with fallback to mock data
