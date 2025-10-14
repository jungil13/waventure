# Owner Earnings API Documentation

This document describes the API endpoints for the Owner Earnings functionality in the Waventure application.

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

### 1. Get Owner Earnings
Get paginated earnings data for a specific boat owner with optional date filtering.

**Endpoint:** `GET /bookings/owner/:ownerId/earnings`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner
- `startDate` (query parameter, optional): Start date for filtering (YYYY-MM-DD format)
- `endDate` (query parameter, optional): End date for filtering (YYYY-MM-DD format)
- `page` (query parameter, optional): Page number for pagination (default: 1)
- `limit` (query parameter, optional): Number of items per page (default: 10)

**Example Request:**
```
GET /bookings/owner/2/earnings?startDate=2025-08-01&endDate=2025-08-31&page=1&limit=10
```

**Response:**
```json
{
  "earnings": [
    {
      "id": 2,
      "boat": "BARKO BARKO",
      "customer": "Honey Kate Padilla",
      "date": "2025-08-16",
      "time": "17:19:00",
      "amount": 9500.00,
      "status": "Completed",
      "paymentMethod": "COD",
      "paymentStatus": "Paid",
      "meetUpLocation": "Marigondon Port Lapu-Lapu City",
      "durationOption": "Full Day",
      "image": "/uploads/boats/1756392357257-Cebu-Boat-Rental.jpg",
      "customerEmail": "kate@gmail.com",
      "customerPhone": null,
      "addons": "Karaoke Set",
      "foodPackage": "Sea Foods",
      "islands": "Sulpa Islands, Nalusuan Island",
      "created_at": "2025-08-29T10:27:01.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

### 2. Get Owner Earnings Statistics
Get comprehensive earnings statistics for a specific boat owner.

**Endpoint:** `GET /bookings/owner/:ownerId/earnings/stats`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner
- `startDate` (query parameter, optional): Start date for filtering (YYYY-MM-DD format)
- `endDate` (query parameter, optional): End date for filtering (YYYY-MM-DD format)

**Example Request:**
```
GET /bookings/owner/2/earnings/stats?startDate=2025-08-01&endDate=2025-08-31
```

**Response:**
```json
{
  "totalRevenue": 9500.00,
  "totalBookings": 3,
  "completedBookings": 1,
  "avgBookingValue": 9500.00,
  "currentMonthRevenue": 9500.00,
  "currentMonthBookings": 1,
  "previousMonthRevenue": 0.00,
  "previousMonthBookings": 0,
  "revenueGrowth": 0.0,
  "bookingGrowth": 0.0,
  "firstBookingDate": "2025-08-16",
  "lastBookingDate": "2025-08-16"
}
```

### 3. Get Monthly Earnings Breakdown
Get monthly earnings breakdown for a specific year.

**Endpoint:** `GET /bookings/owner/:ownerId/earnings/monthly`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner
- `year` (query parameter, optional): Year for the breakdown (default: current year)

**Example Request:**
```
GET /bookings/owner/2/earnings/monthly?year=2025
```

**Response:**
```json
[
  {
    "month": 8,
    "month_name": "August",
    "total_bookings": 3,
    "completed_bookings": 1,
    "revenue": 9500.00
  }
]
```

### 4. Export Owner Earnings
Export earnings data in CSV or JSON format.

**Endpoint:** `GET /bookings/owner/:ownerId/earnings/export`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner
- `startDate` (query parameter, optional): Start date for filtering (YYYY-MM-DD format)
- `endDate` (query parameter, optional): End date for filtering (YYYY-MM-DD format)
- `format` (query parameter, optional): Export format - 'csv' or 'json' (default: 'csv')

**Example Request:**
```
GET /bookings/owner/2/earnings/export?startDate=2025-08-01&endDate=2025-08-31&format=csv
```

**CSV Response:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="owner_earnings_2_2025-01-15.csv"

"Booking ID","Boat Name","Customer","Customer Email","Customer Phone","Booking Date","Booking Time","Amount","Status","Payment Method","Payment Status","Meet Up Location","Duration Option","Add-ons","Food Package","Islands","Created At"
"2","BARKO BARKO","Honey Kate Padilla","kate@gmail.com","N/A","2025-08-16","17:19:00","9500.00","Completed","COD","Paid","Marigondon Port Lapu-Lapu City","Full Day","Karaoke Set","Sea Foods","Sulpa Islands; Nalusuan Island","2025-08-29T10:27:01.000Z"
```

**JSON Response:**
```json
{
  "ownerId": 2,
  "exportDate": "2025-01-15T10:30:00.000Z",
  "totalRecords": 1,
  "data": [
    {
      "Booking ID": 2,
      "Boat Name": "BARKO BARKO",
      "Customer": "Honey Kate Padilla",
      "Customer Email": "kate@gmail.com",
      "Customer Phone": "N/A",
      "Booking Date": "2025-08-16",
      "Booking Time": "17:19:00",
      "Amount": 9500.00,
      "Status": "Completed",
      "Payment Method": "COD",
      "Payment Status": "Paid",
      "Meet Up Location": "Marigondon Port Lapu-Lapu City",
      "Duration Option": "Full Day",
      "Add-ons": "Karaoke Set",
      "Food Package": "Sea Foods",
      "Islands": "Sulpa Islands; Nalusuan Island",
      "Created At": "2025-08-29T10:27:01.000Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid date format. Use YYYY-MM-DD format"
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
  "message": "Failed to fetch owner earnings",
  "error": "Database connection error"
}
```

## Data Models

### Earnings Record
```typescript
interface EarningsRecord {
  id: number;
  boat: string;
  customer: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentMethod: 'GCash' | 'COD';
  paymentStatus: 'Unpaid' | 'Paid';
  meetUpLocation: string;
  durationOption: string;
  image: string | null;
  customerEmail: string;
  customerPhone: string | null;
  addons: string;
  foodPackage: string;
  islands: string;
  created_at: string; // ISO 8601 format
}
```

### Earnings Statistics
```typescript
interface EarningsStats {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  avgBookingValue: number;
  currentMonthRevenue: number;
  currentMonthBookings: number;
  previousMonthRevenue: number;
  previousMonthBookings: number;
  revenueGrowth: number; // Percentage
  bookingGrowth: number; // Percentage
  firstBookingDate: string | null;
  lastBookingDate: string | null;
}
```

### Monthly Breakdown
```typescript
interface MonthlyEarnings {
  month: number; // 1-12
  month_name: string;
  total_bookings: number;
  completed_bookings: number;
  revenue: number;
}
```

### Pagination
```typescript
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
```

## Usage Examples

### Frontend Integration

```javascript
import { earningsService } from '@/services/earningsService';

// Get earnings with pagination
const earningsData = await earningsService.getOwnerEarnings(ownerId, {
  startDate: '2025-08-01',
  endDate: '2025-08-31',
  page: 1,
  limit: 10
});

// Get earnings statistics
const stats = await earningsService.getOwnerEarningsStats(ownerId, {
  startDate: '2025-08-01',
  endDate: '2025-08-31'
});

// Get monthly breakdown
const monthlyData = await earningsService.getOwnerMonthlyEarnings(ownerId, 2025);

// Export earnings as CSV
await earningsService.exportOwnerEarnings(ownerId, {
  startDate: '2025-08-01',
  endDate: '2025-08-31',
  format: 'csv'
});
```

### Axios Direct Usage

```javascript
import axios from 'axios';

// Get earnings data
const response = await axios.get(`http://localhost:5000/api/bookings/owner/${ownerId}/earnings`, {
  params: {
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    page: 1,
    limit: 10
  }
});

// Get statistics
const statsResponse = await axios.get(`http://localhost:5000/api/bookings/owner/${ownerId}/earnings/stats`, {
  params: {
    startDate: '2025-08-01',
    endDate: '2025-08-31'
  }
});
```

## Date Filtering

### Supported Date Formats
- **YYYY-MM-DD**: Standard ISO date format
- **YYYY-MM**: Month filter (automatically converts to first and last day of month)

### Date Range Examples
```javascript
// Current month
const currentMonth = earningsService.getCurrentMonthRange();

// Last month
const lastMonth = earningsService.getLastMonthRange();

// Current year
const currentYear = earningsService.getCurrentYearRange();

// Custom range
const customRange = {
  startDate: '2025-08-01',
  endDate: '2025-08-31'
};
```

## Performance Considerations

### Pagination
- Default page size is 10 items
- Maximum recommended page size is 100 items
- Use pagination for large datasets to improve performance

### Date Filtering
- Always use date filters when possible to reduce query time
- Index on `booking_date` column for optimal performance
- Consider caching for frequently accessed statistics

### Export Operations
- CSV exports are streamed for large datasets
- JSON exports include metadata for better client handling
- Consider background processing for very large exports

## Security Notes

1. **Authentication Required**: All endpoints require valid JWT token
2. **Owner Authorization**: Users can only access their own earnings data
3. **Data Validation**: All input parameters are validated
4. **SQL Injection Protection**: All queries use parameterized statements
5. **Rate Limiting**: Consider implementing rate limiting for export endpoints

## Database Schema

The earnings API uses the existing booking-related tables:

- **`bookings`** - Main booking records
- **`boats`** - Boat information linked to owners
- **`users`** - Customer and owner information
- **`booking_addons`** - Add-ons selected for bookings
- **`booking_foodpackages`** - Food packages selected
- **`booking_islands`** - Islands selected for tours
- **`addons`** - Available add-ons
- **`foodpackages`** - Available food packages
- **`islands`** - Available island destinations
- **`boatimages`** - Boat images

## Notes

1. **Revenue Calculation**: Only completed bookings are included in revenue calculations
2. **Growth Metrics**: Growth percentages are calculated compared to the previous month
3. **Image URLs**: All image URLs are relative paths that need to be prefixed with the server URL
4. **Timezone**: All dates are stored and returned in UTC
5. **Currency**: All amounts are in Philippine Peso (₱)
6. **Export Limits**: Consider implementing limits for export operations to prevent server overload
