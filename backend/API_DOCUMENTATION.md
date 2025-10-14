# Owner Bookings API Documentation

This document describes the API endpoints for the Owner Bookings functionality in the Waventure application.

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

### 1. Get Owner Bookings
Get all bookings for a specific boat owner.

**Endpoint:** `GET /bookings/owner/:ownerId`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner

**Response:**
```json
[
  {
    "id": 2,
    "boat": "BARKO BARKO",
    "customer": "Honey Kate Padilla",
    "date": "2025-08-16",
    "time": "17:19:00",
    "island": "Sulpa Islands, Nalusuan Island",
    "foodPackage": "Sea Foods",
    "addons": "Karaoke Set",
    "amount": 9500.00,
    "status": "Completed",
    "paymentMethod": "COD",
    "paymentStatus": "Paid",
    "meetUpLocation": "Marigondon Port Lapu-Lapu City",
    "durationOption": "Full Day",
    "image": "/uploads/boats/1756392357257-Cebu-Boat-Rental.jpg",
    "customerEmail": "kate@gmail.com",
    "customerPhone": null,
    "customerLocation": null,
    "history": [
      "Booking created on 2025-08-29",
      "Status: Completed",
      "Payment: Paid"
    ],
    "fullDetails": {
      "booking_id": 2,
      "boat_name": "BARKO BARKO",
      "boat_features": "\"GPS, Life Jackets, Sound System\"",
      "boat_capacity": 12,
      "boat_type": "Speedboat",
      "rental_price": 6000.00,
      "duration_options": "\"Half-day, Full-day\"",
      "boat_images": ["/uploads/boats/1756392357257-Cebu-Boat-Rental.jpg"],
      "addons": [
        {
          "addon_id": 3,
          "name": "Karaoke Set",
          "description": "Kanta",
          "price": 500.00,
          "images": "[\"/uploads/boats/1756406298296-fa.jpeg\"]",
          "quantity": 1
        }
      ],
      "foodpackages": [
        {
          "package_id": 8,
          "name": "Sea Foods",
          "description": "SEA FOODS",
          "price": 3000.00,
          "images": "[\"/uploads/boats/1756406233469-pizap.com14349133520391.jpg\"]",
          "quantity": 1
        }
      ],
      "islands": [
        {
          "island_id": 1,
          "name": "Sulpa Islands",
          "description": "Beautiful small island",
          "images": "[\"/uploads/boats/1756396973258-Sulpa-Island-Lapu-Lapu-1024x576-1.jpg\"]",
          "price": 200.00,
          "features": "White Sands, Snorkling"
        },
        {
          "island_id": 4,
          "name": "Nalusuan Island",
          "description": "Beautiful small island",
          "images": "[\"/uploads/boats/1756397015294-nalusuan-island-mactan.jpg\"]",
          "price": 200.00,
          "features": "White Sands, Snorkling"
        }
      ],
      "customer_details": {
        "full_name": "Honey Kate Padilla",
        "email": "kate@gmail.com",
        "phone_number": null,
        "location": null
      }
    }
  }
]
```

### 2. Get Owner Booking Statistics
Get booking statistics for a specific boat owner.

**Endpoint:** `GET /bookings/owner/:ownerId/stats`

**Parameters:**
- `ownerId` (path parameter): The ID of the boat owner

**Response:**
```json
{
  "totalBookings": 3,
  "pendingCount": 1,
  "confirmedCount": 0,
  "completedCount": 1,
  "cancelledCount": 1,
  "totalRevenue": 9500.00
}
```

### 3. Get Owner Booking Details
Get detailed information for a specific booking.

**Endpoint:** `GET /bookings/owner/details/:bookingId`

**Parameters:**
- `bookingId` (path parameter): The ID of the booking

**Response:**
```json
{
  "id": 2,
  "boat": "BARKO BARKO",
  "customer": "Honey Kate Padilla",
  "date": "2025-08-16",
  "time": "17:19:00",
  "island": "Sulpa Islands, Nalusuan Island",
  "foodPackage": "Sea Foods",
  "addons": "Karaoke Set",
  "amount": 9500.00,
  "status": "Completed",
  "paymentMethod": "COD",
  "paymentStatus": "Paid",
  "meetUpLocation": "Marigondon Port Lapu-Lapu City",
  "durationOption": "Full Day",
  "image": "/uploads/boats/1756392357257-Cebu-Boat-Rental.jpg",
  "customerEmail": "kate@gmail.com",
  "customerPhone": null,
  "customerLocation": null,
  "history": [
    "Booking created on 2025-08-29",
    "Status: Completed",
    "Payment: Paid"
  ],
  "fullDetails": {
    // ... same structure as above
  }
}
```

### 4. Update Booking Status
Update the status of a specific booking.

**Endpoint:** `PUT /bookings/:bookingId/status`

**Parameters:**
- `bookingId` (path parameter): The ID of the booking

**Request Body:**
```json
{
  "status": "Confirmed"
}
```

**Valid Status Values:**
- `Pending`
- `Confirmed`
- `Completed`
- `Cancelled`

**Response:**
```json
{
  "message": "Booking status updated successfully",
  "status": "Confirmed"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid status. Must be one of: Pending, Confirmed, Completed, Cancelled"
}
```

### 404 Not Found
```json
{
  "message": "Booking not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to fetch owner bookings",
  "error": "Database connection error"
}
```

## Database Schema

The API uses the following database tables:

### `bookings`
- `booking_id` (Primary Key)
- `user_id` (Foreign Key to users table)
- `boat_id` (Foreign Key to boats table)
- `booking_date`
- `booking_time`
- `meet_up_location`
- `duration_option`
- `status` (enum: 'Pending', 'Confirmed', 'Completed', 'Cancelled')
- `payment_method` (enum: 'GCash', 'COD')
- `payment_status` (enum: 'Unpaid', 'Paid')
- `total_price`
- `payment_proof`
- `created_at`

### `boats`
- `boat_id` (Primary Key)
- `owner_id` (Foreign Key to users table)
- `name`
- `features`
- `capacity`
- `boat_type`
- `rental_price`
- `duration_options`
- `status` (enum: 'Available', 'Rented', 'UnderMaintenance')

### `users`
- `user_id` (Primary Key)
- `full_name`
- `email`
- `phone_number`
- `location`
- `bio`
- `user_type` (enum: 'Admin', 'BoatOwner', 'Customer')

### Related Tables
- `booking_addons` - Links bookings to add-ons
- `booking_foodpackages` - Links bookings to food packages
- `booking_islands` - Links bookings to islands
- `addons` - Available add-ons for boats
- `foodpackages` - Available food packages
- `islands` - Available island destinations
- `boatimages` - Boat images

## Usage Examples

### Frontend Integration

```javascript
import { bookingService } from '@/services/bookingService';

// Get owner bookings
const bookings = await bookingService.getOwnerBookings(ownerId);

// Get owner stats
const stats = await bookingService.getOwnerBookingStats(ownerId);

// Update booking status
await bookingService.updateBookingStatus(bookingId, 'Confirmed');

// Get booking details
const details = await bookingService.getOwnerBookingDetails(bookingId);
```

### Axios Direct Usage

```javascript
import axios from 'axios';

// Get owner bookings
const response = await axios.get(`http://localhost:5000/api/bookings/owner/${ownerId}`);

// Update booking status
await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
  status: 'Confirmed'
});
```

## Notes

1. All image URLs are relative paths that need to be prefixed with the server URL (e.g., `http://localhost:5000`)
2. The API automatically handles JSON parsing for complex fields like images, addons, and food packages
3. All timestamps are in ISO format
4. The API includes comprehensive error handling and validation
5. Owner ID is typically obtained from the authenticated user's session
