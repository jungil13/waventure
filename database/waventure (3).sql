-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2025 at 06:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waventure`
--

-- --------------------------------------------------------

--
-- Table structure for table `addons`
--

CREATE TABLE `addons` (
  `addon_id` int(11) NOT NULL,
  `boat_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('Available','Not Available') DEFAULT 'Available',
  `images` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addons`
--

INSERT INTO `addons` (`addon_id`, `boat_id`, `name`, `description`, `price`, `status`, `images`) VALUES
(3, 14, 'Karaoke Set', 'Kanta', 500.00, 'Available', '[\"/uploads/boats/1756406298296-fa.jpeg\"]'),
(4, 16, 'Kayak', 'Kayak Boat', 200.00, 'Available', '[\"/uploads/boats/1756406330418-Sea_Kayak.JPG\"]'),
(5, 14, 'Snorkeling Gear', 'gear', 250.00, 'Available', '[\"/uploads/boats/1756406451833-basicsnorkelset-2048px-4051.jpg\"]'),
(6, 17, 'Kayak', 'kayak ta', 201.00, 'Available', '[\"/uploads/boats/1756490716951-Evening-kayaking-Svolvaer-Lofoten-XXlofoten-1.jpg\"]'),
(7, 17, 'Life Jackets', 'Para Safe haha', 200.00, 'Available', '[\"/uploads/boats/1756490760913-life-jacket-types.jpg\"]'),
(8, 17, 'Snorkeling Gear', 'sawmsawm ba ', 500.00, 'Available', '[\"/uploads/boats/1756490795002-Cressi_Fullface_Duke_Snorkeling_Mask-Tab-transparent.jpg\"]');

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` int(11) NOT NULL,
  `type` enum('new_booking','booking_status','boat_maintenance') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `boat_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `type`, `title`, `message`, `booking_id`, `boat_id`, `user_id`, `is_read`, `created_at`) VALUES
(1, 'new_booking', 'New Booking Request', 'John Doe has made a new booking for Speed Boat 1 (₱5,000)', 1, 1, 1, 1, '2025-09-15 16:37:59'),
(2, 'booking_status', 'Booking Status Updated', 'Booking #1 for Speed Boat 1 (John Doe) has been confirmed by Boat Owner', 1, 1, 1, 1, '2025-09-15 16:37:59'),
(3, 'boat_maintenance', 'Boat Maintenance Update', 'Speed Boat 1 (Owner: Jane Smith) status changed to UnderMaintenance', NULL, 1, 2, 1, '2025-09-15 16:37:59'),
(4, 'new_booking', 'New Booking Request', 'John Doe has made a new booking for Speed Boat 1 (₱5,000)', 1, 1, 1, 1, '2025-09-15 16:38:02'),
(5, 'booking_status', 'Booking Status Updated', 'Booking #1 for Speed Boat 1 (John Doe) has been confirmed by Boat Owner', 1, 1, 1, 1, '2025-09-15 16:38:02'),
(6, 'boat_maintenance', 'Boat Maintenance Update', 'Speed Boat 1 (Owner: Jane Smith) status changed to UnderMaintenance', NULL, 1, 2, 1, '2025-09-15 16:38:02'),
(7, 'booking_status', 'Booking Status Updated', 'Booking #6 for Sailor Swift (Honey Kate Padilla) has been confirmed by Boat Owner', 6, 16, 4, 1, '2025-09-15 17:40:29'),
(8, 'booking_status', 'Booking Status Updated', 'Booking #6 for Sailor Swift (Honey Kate Padilla) has been completed by Boat Owner', 6, 16, 4, 1, '2025-09-15 17:50:37'),
(9, 'booking_status', 'Booking Status Updated', 'Booking #6 for Sailor Swift (Honey Kate Padilla) has been completed by Boat Owner', 6, 16, 4, 1, '2025-09-15 17:54:23'),
(10, 'new_booking', 'New Booking Request', 'undefined has made a new booking for Super Ferry Tail (₱5000.00)', 8, 14, 4, 1, '2025-09-16 04:51:32'),
(11, 'new_booking', 'New Booking Request', 'undefined has made a new booking for Super Ferry Tail (₱6000.00)', 9, 14, 4, 1, '2025-09-16 04:51:54'),
(12, 'new_booking', 'New Booking Request', 'undefined has made a new booking for Super Ferry Tail (₱7000.00)', 10, 14, 4, 1, '2025-09-16 04:58:50'),
(13, 'new_booking', 'New Booking Request', 'Mikha Lim has made a new booking for Kris Luci (₱5100.00)', 11, 17, 5, 1, '2025-10-13 23:48:06'),
(14, 'new_booking', 'New Booking Request', 'Mikha Lim has made a new booking for ELENA SAIL (₱3200.00)', 12, 20, 5, 0, '2025-10-14 15:04:24'),
(15, 'new_booking', 'New Booking Request', 'Mikha Lim has made a new booking for Super Ferry Tail (₱10200.00)', 13, 14, 5, 0, '2025-10-14 15:06:43'),
(16, 'new_booking', 'New Booking Request', 'Mikha Lim has made a new booking for Super Ferry Tail (₱7500.00)', 14, 14, 5, 0, '2025-10-14 15:17:19'),
(17, 'new_booking', 'New Booking Request', 'Mikha Lim has made a new booking for Super Ferry Tail (₱7300.00)', 15, 14, 5, 0, '2025-10-14 15:28:17');

-- --------------------------------------------------------

--
-- Table structure for table `boatimages`
--

CREATE TABLE `boatimages` (
  `image_id` int(11) NOT NULL,
  `boat_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `boatimages`
--

INSERT INTO `boatimages` (`image_id`, `boat_id`, `image_url`) VALUES
(1, 14, '/uploads/boats/1756392357257-Cebu-Boat-Rental.jpg'),
(2, 14, '/uploads/boats/1756392398543-0da3f900-3d9d-4047-bb01-337c5e57749e_4-hour-private-boracay-island-hopping-tour-xlarge.jpg'),
(3, 16, '/uploads/boats/1756392433315-activity20_pic03.jpg'),
(4, 15, '/uploads/boats/1756392695164-boat2.jpeg'),
(8, 17, '/uploads/boats/1756487305533-boat-for-island-hopping.jpeg'),
(10, 19, '/uploads/boats/1756488216740-Cebu-Boat-Rental (1).jpg'),
(11, 17, '/uploads/boats/1756488606666-Guests-availing-our-boat-rental-for-island-hopping.jpg'),
(12, 20, '/uploads/boats/1756488801732-8a.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `boats`
--

CREATE TABLE `boats` (
  `boat_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `features` text DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `boat_type` varchar(50) DEFAULT NULL,
  `rental_price` decimal(10,2) NOT NULL,
  `duration_options` varchar(100) DEFAULT NULL,
  `status` enum('Available','Rented','UnderMaintenance') DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `boats`
--

INSERT INTO `boats` (`boat_id`, `owner_id`, `name`, `features`, `capacity`, `boat_type`, `rental_price`, `duration_options`, `status`) VALUES
(14, 2, 'Super Ferry Tail', '\"[\\\"GPS, Life Jackets, Sound System\\\"]\"', 12, 'Speedboat', 6000.00, '\"Half-day, Full-day\"', 'Available'),
(15, 1, 'Speed Boat', '\"GPS,Life Jackets,Sound System\"', 12, 'Speedboat', 6000.00, '[\"Half-day\",\"Full-day\"]', 'Rented'),
(16, 2, 'Sailor Swift', '\"[\\\"Secreet, wako kabalo\\\"]\"', 10, 'Bangka', 2000.00, '\"Full Day\"', 'Available'),
(17, 9, 'Kris Luci', '\"[\\\"GPS\\\",\\\"SOUND SYSTEM\\\",\\\"CR\\\",\\\"BEDROOM\\\"]\"', 10, 'Bangka', 2500.00, '\"Full Day\"', 'Available'),
(19, 9, 'SailorSail', '\"[\\\"GPS,Life Jackets,Sound System\\\"]\"', 10, 'Bangka', 1500.00, '\"Full-Day\"', 'Available'),
(20, 9, 'ELENA SAIL', '\"[\\\"GPS,Life Jackets,Sound System\\\"]\"', 15, 'Bangka', 2000.00, '\"Half-Day\"', 'Available');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `boat_id` int(11) DEFAULT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `meet_up_location` enum('RORO Port Cordova','Marigondon Port Lapu-Lapu City') NOT NULL,
  `duration_option` varchar(50) DEFAULT NULL,
  `status` enum('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Pending',
  `payment_method` enum('GCash','COD') NOT NULL,
  `payment_status` enum('Unpaid','Paid') DEFAULT 'Unpaid',
  `total_price` decimal(10,2) DEFAULT NULL,
  `payment_proof` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT 'Soft delete flag: 0 = active, 1 = deleted',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when booking was soft deleted',
  `deleted_by` int(11) DEFAULT NULL COMMENT 'User ID who deleted the booking',
  `deletion_reason` varchar(255) DEFAULT NULL COMMENT 'Reason for deletion'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `boat_id`, `booking_date`, `booking_time`, `meet_up_location`, `duration_option`, `status`, `payment_method`, `payment_status`, `total_price`, `payment_proof`, `created_at`, `is_deleted`, `deleted_at`, `deleted_by`, `deletion_reason`) VALUES
(2, 4, 14, '2025-08-16', '17:19:00', 'Marigondon Port Lapu-Lapu City', 'Full Day', 'Confirmed', 'COD', 'Paid', 9500.00, '/uploads/payments/1757150371621-c3b3ef3d94cddaf939d67ae0f9126927.jpg', '2025-08-29 10:27:01', 0, NULL, NULL, NULL),
(3, 5, 16, '2025-08-30', '19:37:00', 'Marigondon Port Lapu-Lapu City', 'Full Day', 'Cancelled', 'GCash', 'Paid', 4700.00, '/uploads/payments/1757150371621-c3b3ef3d94cddaf939d67ae0f9126927.jpg', '2025-08-29 10:37:37', 0, NULL, NULL, NULL),
(6, 4, 16, '2025-08-21', '00:05:00', '', 'Full Day', 'Completed', 'GCash', 'Paid', 5000.00, '/uploads/payments/1757150371621-c3b3ef3d94cddaf939d67ae0f9126927.jpg', '2025-08-29 16:17:50', 1, '2025-09-16 06:26:21', 4, 'other'),
(7, 4, 17, '2025-09-26', '08:18:00', 'RORO Port Cordova', 'Full Day', 'Pending', 'GCash', 'Unpaid', 4900.00, '/uploads/payments/1757150371621-c3b3ef3d94cddaf939d67ae0f9126927.jpg', '2025-09-06 09:19:31', 0, NULL, NULL, NULL),
(11, 5, 17, '2025-10-14', '08:49:00', 'RORO Port Cordova', 'Full Day', 'Cancelled', 'GCash', 'Unpaid', 5100.00, '/uploads/payments/1760399286215-554323959_1169902471866039_8039662850094109237_n.jpg', '2025-10-13 23:48:06', 0, NULL, NULL, NULL),
(12, 5, 20, '2025-10-15', '14:03:00', 'RORO Port Cordova', 'Full Day', 'Pending', 'GCash', '', 3200.00, '/uploads/payments/1760454264537-557938433_768813205978222_7049633386877265862_n.jpg', '2025-10-14 15:04:24', 0, NULL, NULL, NULL),
(15, 5, 14, '2025-10-16', '15:27:00', 'RORO Port Cordova', 'Full Day', 'Confirmed', 'GCash', 'Paid', 7300.00, '/uploads/payments/1760455697345-c3b3ef3d94cddaf939d67ae0f9126927.jpg', '2025-10-14 15:28:17', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_addons`
--

CREATE TABLE `booking_addons` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `addon_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_addons`
--

INSERT INTO `booking_addons` (`id`, `booking_id`, `addon_id`, `quantity`) VALUES
(1, 2, 3, 1),
(2, 3, 4, 1),
(5, 6, 4, 1),
(6, 7, 6, 1),
(7, 11, 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `booking_foodpackages`
--

CREATE TABLE `booking_foodpackages` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_foodpackages`
--

INSERT INTO `booking_foodpackages` (`id`, `booking_id`, `package_id`, `quantity`) VALUES
(1, 2, 8, 1),
(2, 3, 9, 1),
(4, 6, NULL, 1),
(5, 7, NULL, 1),
(6, 11, 11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `booking_history`
--

CREATE TABLE `booking_history` (
  `history_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `action` enum('created','updated','deleted','restored','status_changed','payment_updated') NOT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Previous values before change' CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'New values after change' CHECK (json_valid(`new_values`)),
  `changed_by` int(11) DEFAULT NULL COMMENT 'User ID who made the change',
  `change_reason` varchar(255) DEFAULT NULL COMMENT 'Reason for the change',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tracks all changes to bookings for audit trail';

--
-- Dumping data for table `booking_history`
--

INSERT INTO `booking_history` (`history_id`, `booking_id`, `action`, `old_values`, `new_values`, `changed_by`, `change_reason`, `created_at`) VALUES
(1, 6, 'deleted', '{\"booking_id\":6,\"user_id\":4,\"boat_id\":16,\"booking_date\":\"2025-08-20T16:00:00.000Z\",\"booking_time\":\"00:05:00\",\"meet_up_location\":\"\",\"duration_option\":\"Full Day\",\"status\":\"Completed\",\"payment_method\":\"GCash\",\"payment_status\":\"Paid\",\"total_price\":\"5000.00\",\"payment_proof\":\"/uploads/payments/1757150371621-c3b3ef3d94cddaf939d67ae0f9126927.jpg\",\"created_at\":\"2025-08-29T16:17:50.000Z\",\"is_deleted\":0,\"deleted_at\":null,\"deleted_by\":null,\"deletion_reason\":null,\"full_name\":\"Honey Kate Padilla\",\"email\":\"kate@gmail.com\",\"phone_number\":null,\"location\":\"Bangkal Basak Cagudoy lapu lapu City\",\"boat_name\":\"Sailor Swift\",\"boat_features\":\"\\\"[\\\\\\\"Secreet, wako kabalo\\\\\\\"]\\\"\",\"capacity\":10,\"boat_type\":\"Bangka\",\"rental_price\":\"2000.00\",\"duration_options\":\"\\\"Full Day\\\"\",\"boat_images\":[\"/uploads/boats/1756392433315-activity20_pic03.jpg\"],\"addons\":[{\"addon_id\":4,\"name\":\"Kayak\",\"description\":\"Kayak Boat\",\"price\":200,\"images\":\"[\\\"/uploads/boats/1756406330418-Sea_Kayak.JPG\\\"]\",\"quantity\":1}],\"foodpackages\":[],\"islands\":[{\"island_id\":3,\"name\":\"Caohagan Island\",\"description\":\"Beautiful small island\",\"images\":\"[\\\"/uploads/boats/1756396991976-caohagan-island.jpg\\\"]\",\"price\":300,\"features\":\"White Sands, Snorkling\"}]}', '{\"is_deleted\":1,\"deleted_at\":\"2025-09-16T06:18:41.514Z\",\"deletion_reason\":\"change_plans\"}', NULL, 'change_plans', '2025-09-16 06:18:41'),
(2, 6, 'deleted', '{\"booking_id\":6,\"user_id\":4,\"boat_id\":16,\"booking_date\":\"2025-08-20T16:00:00.000Z\",\"booking_time\":\"00:05:00\",\"meet_up_location\":\"\",\"duration_option\":\"Full Day\",\"status\":\"Completed\",\"payment_method\":\"GCash\",\"payment_status\":\"Paid\",\"total_price\":\"5000.00\",\"payment_proof\":\"/uploads/payments/1757150371621-c3b3ef3d94cddaf939d67ae0f9126927.jpg\",\"created_at\":\"2025-08-29T16:17:50.000Z\",\"is_deleted\":0,\"deleted_at\":\"2025-09-16T06:18:41.000Z\",\"deleted_by\":null,\"deletion_reason\":\"change_plans\",\"full_name\":\"Honey Kate Padilla\",\"email\":\"kate@gmail.com\",\"phone_number\":null,\"location\":\"Bangkal Basak Cagudoy lapu lapu City\",\"boat_name\":\"Sailor Swift\",\"boat_features\":\"\\\"[\\\\\\\"Secreet, wako kabalo\\\\\\\"]\\\"\",\"capacity\":10,\"boat_type\":\"Bangka\",\"rental_price\":\"2000.00\",\"duration_options\":\"\\\"Full Day\\\"\",\"boat_images\":[\"/uploads/boats/1756392433315-activity20_pic03.jpg\"],\"addons\":[{\"addon_id\":4,\"name\":\"Kayak\",\"description\":\"Kayak Boat\",\"price\":200,\"images\":\"[\\\"/uploads/boats/1756406330418-Sea_Kayak.JPG\\\"]\",\"quantity\":1}],\"foodpackages\":[],\"islands\":[{\"island_id\":3,\"name\":\"Caohagan Island\",\"description\":\"Beautiful small island\",\"images\":\"[\\\"/uploads/boats/1756396991976-caohagan-island.jpg\\\"]\",\"price\":300,\"features\":\"White Sands, Snorkling\"}]}', '{\"is_deleted\":1,\"deleted_at\":\"2025-09-16T06:26:21.858Z\",\"deleted_by\":4,\"deletion_reason\":\"other\"}', 4, 'other', '2025-09-16 06:26:21');

-- --------------------------------------------------------

--
-- Table structure for table `booking_islands`
--

CREATE TABLE `booking_islands` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `island_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_islands`
--

INSERT INTO `booking_islands` (`id`, `booking_id`, `island_id`) VALUES
(1, 2, 1),
(2, 2, 4),
(3, 3, 3),
(4, 3, 6),
(5, 6, 3),
(6, 7, 2),
(7, 11, 2),
(8, 11, 1),
(9, 12, 1),
(10, 12, 2),
(16, 15, 2),
(17, 15, 3);

-- --------------------------------------------------------

--
-- Table structure for table `foodpackages`
--

CREATE TABLE `foodpackages` (
  `package_id` int(11) NOT NULL,
  `boat_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('Available','Not Available') DEFAULT 'Available',
  `images` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `foodpackages`
--

INSERT INTO `foodpackages` (`package_id`, `boat_id`, `name`, `description`, `price`, `status`, `images`) VALUES
(7, 14, 'Burger', 'Yummy Burger', 700.00, 'Available', '[\"/uploads/boats/1756406199714-essence-burger-set.jpg\"]'),
(8, 14, 'Sea Foods', 'SEA FOODS', 3000.00, 'Available', '[\"/uploads/boats/1756406233469-pizap.com14349133520391.jpg\"]'),
(9, 16, 'Lechon', 'tagubkub', 2500.00, 'Available', '[\"/uploads/boats/1756406266634-lechon-in-the-philippines-a-guide-to-filipinos-favorite-roasted-pig-and-more-2.jpg\"]'),
(10, 17, 'Sea Foods', 'Sea Foods with drinks and Fruits', 1400.00, 'Available', '[\"/uploads/boats/1756490613476-food.jpg\"]'),
(11, 17, 'Package 1', 'Sea Foods bastaa', 1200.00, 'Available', '[\"/uploads/boats/1756490695479-dasd.jpeg\"]'),
(12, 20, 'Sea Food Packages', 'Sea Foods such as shrimp, fish, crabs, sea urchins etc.', 2000.00, 'Available', '[\"/uploads/boats/1758004490772-Seafood-Boodle_philippines.jpg\"]');

-- --------------------------------------------------------

--
-- Table structure for table `islands`
--

CREATE TABLE `islands` (
  `island_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`images`)),
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `price` decimal(10,2) DEFAULT 0.00,
  `features` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `islands`
--

INSERT INTO `islands` (`island_id`, `name`, `description`, `images`, `status`, `created_by`, `created_at`, `price`, `features`) VALUES
(1, 'Sulpa Islands', 'Beautiful small island', '[\"/uploads/boats/1756396973258-Sulpa-Island-Lapu-Lapu-1024x576-1.jpg\"]', 'Approved', 2, '2025-08-28 15:29:48', 200.00, 'White Sands, Snorkling'),
(2, 'Gilutungan Island', 'Beautiful small island', '[\"/uploads/boats/1756396416066-Cebu-Boat-Rental.jpg\"]', 'Approved', 2, '2025-08-28 15:32:30', 1000.00, 'White Sand, Snorkling'),
(3, 'Caohagan Island', 'Beautiful small island', '[\"/uploads/boats/1756396991976-caohagan-island.jpg\"]', 'Approved', 2, '2025-08-28 15:32:47', 300.00, 'White Sands, Snorkling'),
(4, 'Nalusuan Island', 'Beautiful small islands', '[\"/uploads/boats/1756397015294-nalusuan-island-mactan.jpg\"]', 'Approved', 2, '2025-08-28 15:33:06', 200.00, 'White Sands, Snorkling'),
(6, 'Olango Island', 'Beatiful and Cozy Island perfect for couples', '[\"/uploads/boats/1756397074554-olango-island-philippines.jpeg\",\"/uploads/boats/1756397086325-563989675.jpg\"]', 'Approved', 2, '2025-08-28 16:04:34', 100.00, 'White Sands, Snorkling');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

CREATE TABLE `maintenance` (
  `maintenance_id` int(11) NOT NULL,
  `boat_id` int(11) NOT NULL,
  `scheduled_date` date NOT NULL,
  `scheduled_time` time NOT NULL,
  `maintenance_type` enum('Routine','Repair','Inspection','Emergency') NOT NULL DEFAULT 'Routine',
  `description` text DEFAULT NULL,
  `status` enum('Scheduled','In Progress','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `assigned_technician` varchar(100) DEFAULT NULL,
  `estimated_duration` int(11) DEFAULT NULL COMMENT 'Duration in hours',
  `actual_duration` int(11) DEFAULT NULL COMMENT 'Actual duration in hours',
  `cost` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL COMMENT 'Admin who scheduled the maintenance',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance`
--

INSERT INTO `maintenance` (`maintenance_id`, `boat_id`, `scheduled_date`, `scheduled_time`, `maintenance_type`, `description`, `status`, `assigned_technician`, `estimated_duration`, `actual_duration`, `cost`, `notes`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 19, '2025-09-11', '21:47:00', 'Repair', 'Naay liki sa kilid ', 'Completed', 'Juan De la Cruz', 2, 2, 500.00, 'I pa ayo nani kay need na', 3, '2025-09-06 11:46:25', '2025-09-07 07:18:28'),
(2, 16, '2025-09-12', '22:46:00', 'Inspection', 'Inspection ra basin naay kuan haha', 'Scheduled', 'Renz Kayle ', 1, NULL, 500.00, 'Wara gud need ra inspect', 3, '2025-09-06 11:47:44', '2025-09-06 11:47:44');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `booking_id`, `message`, `is_read`, `created_at`) VALUES
(1, 2, 4, 2, 'Hello! Thanks for booking with us. Your trip is confirmed for August 16th.', 1, '2025-09-05 22:20:49'),
(2, 4, 2, 2, 'Thank you! What time should we meet at the port?', 1, '2025-09-05 22:25:12'),
(3, 2, 4, 2, 'Please arrive at 8:00 AM. We will be waiting at the main dock.', 1, '2025-09-05 22:30:45'),
(4, 2, 4, 6, 'Your booking for Inday Baroday Sail has been confirmed!', 0, '2025-09-15 02:15:30'),
(5, 4, 2, 6, 'Great! Can you tell me more about the boat amenities?', 0, '2025-09-15 02:20:15');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `boat_id` int(11) DEFAULT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `type` enum('booking_request','booking_update','booking_completed','payment','review','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `owner_id`, `user_id`, `boat_id`, `booking_id`, `type`, `title`, `message`, `is_read`, `created_at`) VALUES
(10, 1, 1, NULL, NULL, 'booking_request', 'Booking Confirmed', 'Your booking for BARKO BARKO has been confirmed by the boat owner.', 1, '2025-09-06 05:29:50'),
(11, 1, 1, NULL, NULL, 'booking_completed', 'Trip Completed', 'Your trip with BARKO BARKO has been completed successfully. Thank you for choosing WAVENTURE!', 1, '2025-09-06 05:29:50'),
(12, 1, 1, NULL, NULL, 'payment', 'Payment Received', 'Your payment of ₱9500 for BARKO BARKO has been received and processed.', 1, '2025-09-06 05:29:50'),
(13, 1, 1, NULL, NULL, 'review', 'Rate Your Experience', 'How was your trip with BARKO BARKO? Please rate and review your experience.', 1, '2025-09-06 05:29:50'),
(14, 9, 4, 17, 7, 'booking_update', 'Trip Completed! ✅', 'Your trip on Kris Luci on 9/26/2025 has been completed. We hope you had a wonderful time! Please consider leaving a review.', 1, '2025-09-15 16:45:28'),
(16, 2, 1, 14, 6, 'booking_update', 'Booking Status Updated', 'Your booking for Super Ferry Tail has been confirmed!', 1, '2025-09-15 17:19:30'),
(17, 2, 1, NULL, NULL, 'system', 'System Notification', 'This is a system-wide notification without boat reference', 1, '2025-09-15 17:19:31'),
(19, 2, 4, 16, 6, 'booking_update', 'Booking Confirmed! 🎉', 'Great news! Your booking for Sailor Swift on 8/21/2025 at 00:05:00 has been confirmed. Get ready for an amazing adventure!', 1, '2025-09-15 17:40:29'),
(20, 2, NULL, 16, 6, 'booking_update', 'Booking Confirmed', 'You have confirmed booking #6 for Sailor Swift', 1, '2025-09-15 17:40:29'),
(21, 2, 4, 16, 6, 'booking_update', 'Trip Completed! ✅', 'Your trip on Sailor Swift on 8/21/2025 has been completed. We hope you had a wonderful time! Please consider leaving a review.', 1, '2025-09-15 17:50:37'),
(22, 2, NULL, 16, 6, 'booking_update', 'Booking Completed', 'You have completed booking #6 for Sailor Swift', 1, '2025-09-15 17:50:37'),
(23, 2, 4, 16, 6, 'booking_update', 'Trip Completed! ✅', 'Your trip on Sailor Swift on 8/21/2025 has been completed. We hope you had a wonderful time! Please consider leaving a review.', 1, '2025-09-15 17:54:23'),
(24, 2, NULL, 16, 6, 'booking_update', 'Booking Completed', 'You have completed booking #6 for Sailor Swift', 1, '2025-09-15 17:54:23'),
(27, 9, 5, 17, 11, 'booking_update', 'Trip Completed! ✅', 'Your trip on Kris Luci has been completed. Hope you had a great time!', 1, '2025-10-14 00:01:22'),
(28, 9, 4, 17, 7, 'booking_update', 'Booking Status Updated', 'Your booking for Kris Luci is now Pending.', 0, '2025-10-14 00:03:11'),
(29, 2, 5, 16, 3, 'booking_update', 'Booking Cancelled ❌', 'Your booking for Sailor Swift on 8/30/2025 was cancelled.', 1, '2025-10-14 00:19:53'),
(30, 9, 5, 17, 11, 'booking_update', 'Booking Status Updated', 'Your booking for Kris Luci is now Pending.', 1, '2025-10-14 00:22:09'),
(31, 9, 5, 17, 11, 'booking_update', 'Booking Cancelled ❌', 'Your booking for Kris Luci on 10/14/2025 was cancelled.', 1, '2025-10-14 00:26:06'),
(32, 9, 5, 20, 12, 'booking_request', 'Booking Request Received', 'Your booking request for ELENA SAIL on 10/15/2025 has been created.', 1, '2025-10-14 15:04:24'),
(33, 9, 5, 20, 12, 'booking_request', 'New Booking Request', 'Mikha Lim requested ELENA SAIL on 10/15/2025.', 1, '2025-10-14 15:04:24'),
(38, 2, 5, 14, 15, 'booking_request', 'Booking Request Received', 'Your booking request for Super Ferry Tail on 10/16/2025 has been created.', 1, '2025-10-14 15:28:17'),
(39, 2, 5, 14, 15, 'booking_request', 'New Booking Request', 'Mikha Lim requested Super Ferry Tail on 10/16/2025.', 1, '2025-10-14 15:28:17'),
(40, 2, 5, 14, 15, 'booking_update', 'Booking Confirmed! 🎉', 'Great news! Your booking for Super Ferry Tail on 10/16/2025 has been confirmed.', 0, '2025-10-14 15:29:25'),
(41, 2, 5, 14, 15, 'booking_update', 'Booking Confirmed! 🎉', 'Great news! Your booking for Super Ferry Tail on 10/16/2025 has been confirmed.', 0, '2025-10-14 15:29:35');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 2, 'e0409c95550713bb7bf22935f6dc4729d5d8a966c2548caea17b26eb48d88bfb', '2025-09-06 18:58:00', '2025-09-06 18:43:00'),
(2, 2, '1ad23e47dfaabd9f441826d1f9b638cf7fa4f4ec59eb739f154fc05351974d9d', '2025-09-06 19:04:06', '2025-09-06 18:49:06');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `boat_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `boat_id`, `user_id`, `rating`, `review_text`, `created_at`) VALUES
(1, 14, 4, 4, 'Amazing experience!', '2025-09-05 20:18:49'),
(2, 14, 4, 5, 'Amazing experience! The boat was clean and the crew was friendly. Highly recommended!', '2025-09-06 10:56:21'),
(3, 16, 5, 4, 'Great trip overall, but the food package could be better. The boat was comfortable though.', '2025-09-06 10:56:21'),
(4, 14, 1, 5, 'Perfect day out! The boat was in excellent condition and the service was top-notch.', '2025-09-06 10:56:21'),
(5, 16, 4, 5, 'woow thank youu', '2025-09-15 14:44:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('Admin','BoatOwner','Customer') NOT NULL,
  `email_notifications` tinyint(1) DEFAULT 1,
  `push_notifications` tinyint(1) DEFAULT 1,
  `newsletter_subscription` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `profile_pic`, `full_name`, `email`, `phone_number`, `phone`, `location`, `bio`, `password_hash`, `password`, `user_type`, `email_notifications`, `push_notifications`, `newsletter_subscription`) VALUES
(1, NULL, 'Juan Dela Cruz', 'juan@example.com', NULL, NULL, NULL, NULL, '$2b$10$amrMhswy20wCBN29NOevNe8krIepjoC6cSrUcvKqzO7SMgEFzFqCa', '$2b$10$amrMhswy20wCBN29NOevNe8krIepjoC6cSrUcvKqzO7SMgEFzFqCa', 'Customer', 1, 1, 0),
(2, '/uploads/profiles/1757228409427-132056332-jinwoo.jpg', 'Sung Jin Woo', 'jungil@gmail.com', '09917198428', '09917198428', 'Cordova Cebu', 'Palaylay na boat owner', '$2b$10$0eQOFKLNf.g5ncNVU1i2PuhV3SSxEuibj/oXJAgN7oL5reeDDIwxi', '$2b$10$0UCxVnLDPhGKZ/SLnzTOH.1qJg0xOyGZt0.wBA.wxoj8h33lB3VVa', 'BoatOwner', 1, 1, 0),
(3, '/uploads/profiles/1757179347664-823012789-1ef8658dbf85c049ed256d05efc45d15.jpg', 'Admin', 'admin@gmail.com', NULL, NULL, NULL, NULL, '$2b$10$yyQh2.LHB5PFukWipHRXEeaHcGQBKfYHGFQgcF0WR56MMyBCnivES', '$2b$10$yyQh2.LHB5PFukWipHRXEeaHcGQBKfYHGFQgcF0WR56MMyBCnivES', 'Admin', 1, 1, 0),
(4, '/uploads/profiles/1757135464534-93194671-dfbf3aa71210d69f871f8a3376795d81.jpg', 'Honey Kate Padilla', 'kate@gmail.com', NULL, '092652321571', 'Bangkal Basak Cagudoy lapu lapu City', 'Mingay5g', '$2b$10$ekeCdyF4tMU3dXHwoDhFFuCPpZ10G02gTvLuIx9Qu1kQtQKUSeUQG', '$2b$10$ekeCdyF4tMU3dXHwoDhFFuCPpZ10G02gTvLuIx9Qu1kQtQKUSeUQG', 'Customer', 1, 1, 0),
(5, '/uploads/profiles/1757138862872-795999521-9fa787cf44159e7fd168954af9cb7cba.jpg', 'Mikha Lim', 'mikha@gmail.com', NULL, NULL, NULL, NULL, '$2b$10$qiS7EtUzsA96d5UkDuk0feI6TQAlSp8rhT8WDqRKw93IqQlwwXJOe', '$2b$10$qiS7EtUzsA96d5UkDuk0feI6TQAlSp8rhT8WDqRKw93IqQlwwXJOe', 'Customer', 1, 1, 0),
(8, NULL, 'Renz Kayle Ando', 'renz@gmail.com', NULL, NULL, NULL, NULL, '$2b$10$vFOlumJHuS4xepOuhFcuvO.tmU0YLuuSY5qjN966Rbi1eoc8BN982', '$2b$10$vFOlumJHuS4xepOuhFcuvO.tmU0YLuuSY5qjN966Rbi1eoc8BN982', 'BoatOwner', 1, 1, 0),
(9, '/uploads/profiles/1757155527806-700779720-2023.03.24-08.43-boundingintocomics-641e0b6b65b2d.png', 'Mark Jayson Cayude', 'mark@gmail.com', NULL, '0945678912', 'Caumbay Cordova Cebu', 'Infinity and beyond', '$2b$10$M3aB0L2CAZWqRL2jGmCi2OTbAFh4fAhh/bL3sqaS1beQABTtoCBtK', '$2b$10$M3aB0L2CAZWqRL2jGmCi2OTbAFh4fAhh/bL3sqaS1beQABTtoCBtK', 'BoatOwner', 1, 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addons`
--
ALTER TABLE `addons`
  ADD PRIMARY KEY (`addon_id`),
  ADD KEY `boat_id` (`boat_id`);

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_is_read` (`is_read`);

--
-- Indexes for table `boatimages`
--
ALTER TABLE `boatimages`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `boat_id` (`boat_id`);

--
-- Indexes for table `boats`
--
ALTER TABLE `boats`
  ADD PRIMARY KEY (`boat_id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `boat_id` (`boat_id`),
  ADD KEY `idx_is_deleted` (`is_deleted`),
  ADD KEY `idx_deleted_at` (`deleted_at`),
  ADD KEY `idx_user_deleted` (`user_id`,`is_deleted`);

--
-- Indexes for table `booking_addons`
--
ALTER TABLE `booking_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `addon_id` (`addon_id`);

--
-- Indexes for table `booking_foodpackages`
--
ALTER TABLE `booking_foodpackages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `booking_history`
--
ALTER TABLE `booking_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `idx_booking_id` (`booking_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_changed_by` (`changed_by`);

--
-- Indexes for table `booking_islands`
--
ALTER TABLE `booking_islands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `island_id` (`island_id`);

--
-- Indexes for table `foodpackages`
--
ALTER TABLE `foodpackages`
  ADD PRIMARY KEY (`package_id`),
  ADD KEY `boat_id` (`boat_id`);

--
-- Indexes for table `islands`
--
ALTER TABLE `islands`
  ADD PRIMARY KEY (`island_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`maintenance_id`),
  ADD KEY `boat_id` (`boat_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `scheduled_date` (`scheduled_date`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_sender_id` (`sender_id`),
  ADD KEY `idx_receiver_id` (`receiver_id`),
  ADD KEY `idx_booking_id` (`booking_id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_is_read` (`is_read`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `boat_id` (`boat_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `boat_id` (`boat_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addons`
--
ALTER TABLE `addons`
  MODIFY `addon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `boatimages`
--
ALTER TABLE `boatimages`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `boats`
--
ALTER TABLE `boats`
  MODIFY `boat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `booking_addons`
--
ALTER TABLE `booking_addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `booking_foodpackages`
--
ALTER TABLE `booking_foodpackages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `booking_history`
--
ALTER TABLE `booking_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking_islands`
--
ALTER TABLE `booking_islands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `foodpackages`
--
ALTER TABLE `foodpackages`
  MODIFY `package_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `islands`
--
ALTER TABLE `islands`
  MODIFY `island_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addons`
--
ALTER TABLE `addons`
  ADD CONSTRAINT `addons_ibfk_1` FOREIGN KEY (`boat_id`) REFERENCES `boats` (`boat_id`) ON DELETE CASCADE;

--
-- Constraints for table `boatimages`
--
ALTER TABLE `boatimages`
  ADD CONSTRAINT `boatimages_ibfk_1` FOREIGN KEY (`boat_id`) REFERENCES `boats` (`boat_id`) ON DELETE CASCADE;

--
-- Constraints for table `boats`
--
ALTER TABLE `boats`
  ADD CONSTRAINT `boats_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`boat_id`) REFERENCES `boats` (`boat_id`) ON DELETE CASCADE;

--
-- Constraints for table `booking_addons`
--
ALTER TABLE `booking_addons`
  ADD CONSTRAINT `booking_addons_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_addons_ibfk_2` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`addon_id`) ON DELETE CASCADE;

--
-- Constraints for table `booking_foodpackages`
--
ALTER TABLE `booking_foodpackages`
  ADD CONSTRAINT `booking_foodpackages_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_foodpackages_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `foodpackages` (`package_id`) ON DELETE CASCADE;

--
-- Constraints for table `booking_history`
--
ALTER TABLE `booking_history`
  ADD CONSTRAINT `booking_history_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Constraints for table `booking_islands`
--
ALTER TABLE `booking_islands`
  ADD CONSTRAINT `booking_islands_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_islands_ibfk_2` FOREIGN KEY (`island_id`) REFERENCES `islands` (`island_id`) ON DELETE CASCADE;

--
-- Constraints for table `foodpackages`
--
ALTER TABLE `foodpackages`
  ADD CONSTRAINT `foodpackages_ibfk_1` FOREIGN KEY (`boat_id`) REFERENCES `boats` (`boat_id`) ON DELETE CASCADE;

--
-- Constraints for table `islands`
--
ALTER TABLE `islands`
  ADD CONSTRAINT `islands_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`boat_id`) REFERENCES `boats` (`boat_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`boat_id`) REFERENCES `boats` (`boat_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`boat_id`) REFERENCES `boats` (`boat_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
