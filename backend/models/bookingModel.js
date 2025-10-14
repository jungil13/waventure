const db = require("../config/db");

const Booking = {
  create: async (data) => {
    const {
      user_id,
      boat_id,
      booking_date,
      booking_time,
      meet_up_location,
      duration_option,
      status,
      payment_method,
      payment_status,
      total_price,
      payment_proof,
      addons,
      food,
      islands,
    } = data;

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert booking
      const [result] = await conn.query(
        `INSERT INTO bookings 
        (user_id, boat_id, booking_date, booking_time, meet_up_location, duration_option, 
         status, payment_method, payment_status, total_price, payment_proof) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          boat_id,
          booking_date,
          booking_time,
          meet_up_location,
          duration_option,
          status,
          payment_method,
          payment_status,
          total_price,
          payment_proof,
        ]
      );

      const bookingId = result.insertId;

      // Insert addons
      if (addons) {
        const parsedAddons = Array.isArray(addons)
          ? addons
          : JSON.parse(addons);
        for (const addon of parsedAddons) {
          await conn.query(
            `INSERT INTO booking_addons (booking_id, addon_id, quantity) VALUES (?, ?, ?)`,
            [bookingId, addon.addon_id || addon.id, addon.quantity || 1]
          );
        }
      }

      // Insert food (single or multiple packages)
      if (food) {
        // Multer sends text fields as strings; parse JSON when needed
        let parsedFood;
        if (Array.isArray(food)) {
          parsedFood = food;
        } else {
          try {
            const tmp = JSON.parse(food);
            parsedFood = Array.isArray(tmp) ? tmp : [tmp];
          } catch (e) {
            // Fallback: wrap as single object if already an object-like value
            parsedFood = [food];
          }
        }

        for (const pkg of parsedFood) {
          const packageId = pkg && (pkg.package_id || pkg.id);
          if (packageId) {
            await conn.query(
              `INSERT INTO booking_foodpackages (booking_id, package_id, quantity) VALUES (?, ?, ?)`,
              [bookingId, packageId, pkg.quantity || 1]
            );
          }
        }
      }

      // Insert islands
      if (islands) {
        const parsedIslands = Array.isArray(islands)
          ? islands
          : JSON.parse(islands);
        for (const island of parsedIslands) {
          const islandId = island.island_id || island.id; // extract the id
          await conn.query(
            `INSERT INTO booking_islands (booking_id, island_id) VALUES (?, ?)`,
            [bookingId, islandId]
          );
        }
      }

      await conn.commit();
      return bookingId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Check if a boat is available on a specific date (non-deleted, non-cancelled bookings block the date)
  isBoatAvailableOnDate: async (boatId, bookingDate) => {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS cnt
       FROM bookings
       WHERE boat_id = ?
         AND booking_date = ?
         AND is_deleted = 0
         AND status IN ('Pending','Confirmed','Completed')`,
      [boatId, bookingDate]
    );
    return (rows[0]?.cnt || 0) === 0;
  },

  // Get all unavailable dates for a boat
  getUnavailableDatesForBoat: async (boatId) => {
    const [rows] = await db.query(
      `SELECT DISTINCT booking_date
       FROM bookings
       WHERE boat_id = ?
         AND is_deleted = 0
         AND status IN ('Pending','Confirmed','Completed')
       ORDER BY booking_date`,
      [boatId]
    );
    return rows.map(r => r.booking_date);
  },

  // Get all bookings
  getAll: async () => {
    const [rows] = await db.query(`
    SELECT 
      b.*,
      u.full_name,
      bo.name AS boat_name,
      bo.owner_id AS owner_id,
      bo.features AS boat_features,
      bo.capacity,
      bo.boat_type,
      bo.rental_price,
      bo.duration_options,

      -- Boat Images
      (
        SELECT CONCAT('[', GROUP_CONCAT(JSON_QUOTE(bi.image_url)), ']')
        FROM boatimages bi
        WHERE bi.boat_id = bo.boat_id
      ) AS boat_images,

      -- Addons
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'addon_id', a.addon_id,
            'name', a.name,
            'description', a.description,
            'price', a.price,
            'images', a.images,
            'quantity', ba.quantity
          )
        ), ']')
        FROM booking_addons ba
        JOIN addons a ON ba.addon_id = a.addon_id
        WHERE ba.booking_id = b.booking_id
      ) AS addons,

      -- Food Packages
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'package_id', f.package_id,
            'name', f.name,
            'description', f.description,
            'price', f.price,
            'images', f.images,
            'quantity', bf.quantity
          )
        ), ']')
        FROM booking_foodpackages bf
        JOIN foodpackages f ON bf.package_id = f.package_id
        WHERE bf.booking_id = b.booking_id
      ) AS foodpackages,

      -- Islands
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'island_id', i.island_id,
            'name', i.name,
            'description', i.description,
            'images', i.images,
            'price', i.price,
            'features', i.features
          )
        ), ']')
        FROM booking_islands bi
        JOIN islands i ON bi.island_id = i.island_id
        WHERE bi.booking_id = b.booking_id
      ) AS islands

    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN boats bo ON b.boat_id = bo.boat_id
    ORDER BY b.created_at DESC
  `);

    // Convert JSON strings into arrays/objects
    return rows.map((r) => ({
      ...r,
      boat_images: r.boat_images ? JSON.parse(r.boat_images) : [],
      addons: r.addons ? JSON.parse(r.addons) : [],
      foodpackages: r.foodpackages ? JSON.parse(r.foodpackages) : [],
      islands: r.islands ? JSON.parse(r.islands) : [],
    }));
  },
  // Get bookings for a specific user
  getByUserId: async (userId) => {
    const [rows] = await db.query(
      `
    SELECT 
      b.*,
      u.full_name,
      bo.name AS boat_name,
      bo.owner_id AS owner_id,
      bo.features AS boat_features,
      bo.capacity,
      bo.boat_type,
      bo.rental_price,
      bo.duration_options,

      -- Boat Images
      (
        SELECT CONCAT('[', GROUP_CONCAT(JSON_QUOTE(bi.image_url)), ']')
        FROM boatimages bi
        WHERE bi.boat_id = bo.boat_id
      ) AS boat_images,

      -- Addons
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'addon_id', a.addon_id,
            'name', a.name,
            'description', a.description,
            'price', a.price,
            'images', a.images,
            'quantity', ba.quantity
          )
        ), ']')
        FROM booking_addons ba
        JOIN addons a ON ba.addon_id = a.addon_id
        WHERE ba.booking_id = b.booking_id
      ) AS addons,

      -- Food Packages
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'package_id', f.package_id,
            'name', f.name,
            'description', f.description,
            'price', f.price,
            'images', f.images,
            'quantity', bf.quantity
          )
        ), ']')
        FROM booking_foodpackages bf
        JOIN foodpackages f ON bf.package_id = f.package_id
        WHERE bf.booking_id = b.booking_id
      ) AS foodpackages,

      -- Islands
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'island_id', i.island_id,
            'name', i.name,
            'description', i.description,
            'images', i.images,
            'price', i.price,
            'features', i.features
          )
        ), ']')
        FROM booking_islands bi
        JOIN islands i ON bi.island_id = i.island_id
        WHERE bi.booking_id = b.booking_id
      ) AS islands

    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN boats bo ON b.boat_id = bo.boat_id
    WHERE b.user_id = ? AND b.is_deleted = 0
    ORDER BY b.created_at DESC
  `,
      [userId]
    );

    // ✅ Parse JSON strings into real objects/arrays in JS
    return rows.map((r) => ({
      ...r,
      boat_images: r.boat_images ? JSON.parse(r.boat_images) : [],
      addons: r.addons ? JSON.parse(r.addons) : [],
      foodpackages: r.foodpackages ? JSON.parse(r.foodpackages) : [],
      islands: r.islands ? JSON.parse(r.islands) : [],
    }));
  },

  // Get bookings for a specific boat owner
  getByOwnerId: async (ownerId) => {
    const [rows] = await db.query(
      `
    SELECT 
      b.*,
      u.full_name,
      u.email,
      u.phone_number,
      bo.name AS boat_name,
      bo.features AS boat_features,
      bo.capacity,
      bo.boat_type,
      bo.rental_price,
      bo.duration_options,

      -- Boat Images
      (
        SELECT CONCAT('[', GROUP_CONCAT(JSON_QUOTE(bi.image_url)), ']')
        FROM boatimages bi
        WHERE bi.boat_id = bo.boat_id
      ) AS boat_images,

      -- Addons
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'addon_id', a.addon_id,
            'name', a.name,
            'description', a.description,
            'price', a.price,
            'images', a.images,
            'quantity', ba.quantity
          )
        ), ']')
        FROM booking_addons ba
        JOIN addons a ON ba.addon_id = a.addon_id
        WHERE ba.booking_id = b.booking_id
      ) AS addons,

      -- Food Packages
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'package_id', f.package_id,
            'name', f.name,
            'description', f.description,
            'price', f.price,
            'images', f.images,
            'quantity', bf.quantity
          )
        ), ']')
        FROM booking_foodpackages bf
        JOIN foodpackages f ON bf.package_id = f.package_id
        WHERE bf.booking_id = b.booking_id
      ) AS foodpackages,

      -- Islands
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'island_id', i.island_id,
            'name', i.name,
            'description', i.description,
            'images', i.images,
            'price', i.price,
            'features', i.features
          )
        ), ']')
        FROM booking_islands bi
        JOIN islands i ON bi.island_id = i.island_id
        WHERE bi.booking_id = b.booking_id
      ) AS islands

    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN boats bo ON b.boat_id = bo.boat_id
    WHERE bo.owner_id = ? AND b.is_deleted = 0
    ORDER BY b.created_at DESC
  `,
      [ownerId]
    );

    // Parse JSON strings into real objects/arrays
    return rows.map((r) => ({
      ...r,
      boat_images: r.boat_images ? JSON.parse(r.boat_images) : [],
      addons: r.addons ? JSON.parse(r.addons) : [],
      foodpackages: r.foodpackages ? JSON.parse(r.foodpackages) : [],
      islands: r.islands ? JSON.parse(r.islands) : [],
    }));
  },

  // Update booking status
  updateStatus: async (bookingId, status) => {
    const [result] = await db.query(
      `UPDATE bookings SET status = ? WHERE booking_id = ?`,
      [status, bookingId]
    );
    return result.affectedRows > 0;
  },

  // Update payment status
  updatePaymentStatus: async (bookingId, paymentStatus) => {
    const [result] = await db.query(
      `UPDATE bookings SET payment_status = ? WHERE booking_id = ?`,
      [paymentStatus, bookingId]
    );
    return result.affectedRows > 0;
  },

  // Update both status and payment status
  updateStatusAndPayment: async (bookingId, status, paymentStatus) => {
    const [result] = await db.query(
      `UPDATE bookings SET status = ?, payment_status = ? WHERE booking_id = ?`,
      [status, paymentStatus, bookingId]
    );
    return result.affectedRows > 0;
  },

  // Get booking statistics for owner
  getOwnerStats: async (ownerId) => {
    const [rows] = await db.query(
      `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN b.status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed_count,
        SUM(CASE WHEN b.status = 'Completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN b.status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN b.total_price ELSE 0 END) as total_revenue
      FROM bookings b
      JOIN boats bo ON b.boat_id = bo.boat_id
      WHERE bo.owner_id = ? AND b.is_deleted = 0
    `,
      [ownerId]
    );
    return rows[0];
  },

  // Get detailed booking information for owner
  getDetails: async (bookingId) => {
    const [rows] = await db.query(
      `
    SELECT 
      b.*,
      u.full_name,
      u.email,
      u.phone_number,
      u.location,
      bo.name AS boat_name,
      bo.features AS boat_features,
      bo.capacity,
      bo.boat_type,
      bo.rental_price,
      bo.duration_options,
      bo.owner_id,

      -- Boat Images
      (
        SELECT CONCAT('[', GROUP_CONCAT(JSON_QUOTE(bi.image_url)), ']')
        FROM boatimages bi
        WHERE bi.boat_id = bo.boat_id
      ) AS boat_images,

      -- Addons
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'addon_id', a.addon_id,
            'name', a.name,
            'description', a.description,
            'price', a.price,
            'images', a.images,
            'quantity', ba.quantity
          )
        ), ']')
        FROM booking_addons ba
        JOIN addons a ON ba.addon_id = a.addon_id
        WHERE ba.booking_id = b.booking_id
      ) AS addons,

      -- Food Packages
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'package_id', f.package_id,
            'name', f.name,
            'description', f.description,
            'price', f.price,
            'images', f.images,
            'quantity', bf.quantity
          )
        ), ']')
        FROM booking_foodpackages bf
        JOIN foodpackages f ON bf.package_id = f.package_id
        WHERE bf.booking_id = b.booking_id
      ) AS foodpackages,

      -- Islands
      (
        SELECT CONCAT('[', GROUP_CONCAT(
          JSON_OBJECT(
            'island_id', i.island_id,
            'name', i.name,
            'description', i.description,
            'images', i.images,
            'price', i.price,
            'features', i.features
          )
        ), ']')
        FROM booking_islands bi
        JOIN islands i ON bi.island_id = i.island_id
        WHERE bi.booking_id = b.booking_id
      ) AS islands

    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN boats bo ON b.boat_id = bo.boat_id
    WHERE b.booking_id = ? AND b.is_deleted = 0
  `,
      [bookingId]
    );

    if (rows.length === 0) return null;

    const booking = rows[0];
    return {
      ...booking,
      boat_images: booking.boat_images ? JSON.parse(booking.boat_images) : [],
      addons: booking.addons ? JSON.parse(booking.addons) : [],
      foodpackages: booking.foodpackages ? JSON.parse(booking.foodpackages) : [],
      islands: booking.islands ? JSON.parse(booking.islands) : [],
    };
  },

  // Get earnings data for owner with date filtering
  getOwnerEarnings: async (ownerId, startDate = null, endDate = null) => {
    let dateFilter = '';
    let params = [ownerId];
    
    if (startDate && endDate) {
      dateFilter = 'AND b.booking_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      dateFilter = 'AND b.booking_date >= ?';
      params.push(startDate);
    } else if (endDate) {
      dateFilter = 'AND b.booking_date <= ?';
      params.push(endDate);
    }

    const [rows] = await db.query(
      `
      SELECT 
        b.*,
        u.full_name,
        u.email,
        u.phone_number,
        bo.name AS boat_name,
        bo.features AS boat_features,
        bo.capacity,
        bo.boat_type,
        bo.rental_price,
        bo.duration_options,

        -- Boat Images
        (
          SELECT CONCAT('[', GROUP_CONCAT(JSON_QUOTE(bi.image_url)), ']')
          FROM boatimages bi
          WHERE bi.boat_id = bo.boat_id
        ) AS boat_images,

        -- Addons
        (
          SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'addon_id', a.addon_id,
              'name', a.name,
              'description', a.description,
              'price', a.price,
              'images', a.images,
              'quantity', ba.quantity
            )
          ), ']')
          FROM booking_addons ba
          JOIN addons a ON ba.addon_id = a.addon_id
          WHERE ba.booking_id = b.booking_id
        ) AS addons,

        -- Food Packages
        (
          SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'package_id', f.package_id,
              'name', f.name,
              'description', f.description,
              'price', f.price,
              'images', f.images,
              'quantity', bf.quantity
            )
          ), ']')
          FROM booking_foodpackages bf
          JOIN foodpackages f ON bf.package_id = f.package_id
          WHERE bf.booking_id = b.booking_id
        ) AS foodpackages,

        -- Islands
        (
          SELECT CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'island_id', i.island_id,
              'name', i.name,
              'description', i.description,
              'images', i.images,
              'price', i.price,
              'features', i.features
            )
          ), ']')
          FROM booking_islands bi
          JOIN islands i ON bi.island_id = i.island_id
          WHERE bi.booking_id = b.booking_id
        ) AS islands

      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN boats bo ON b.boat_id = bo.boat_id
      WHERE bo.owner_id = ? ${dateFilter}
      ORDER BY b.booking_date DESC, b.created_at DESC
    `,
      params
    );

    // Parse JSON strings into real objects/arrays
    return rows.map((r) => ({
      ...r,
      boat_images: r.boat_images ? JSON.parse(r.boat_images) : [],
      addons: r.addons ? JSON.parse(r.addons) : [],
      foodpackages: r.foodpackages ? JSON.parse(r.foodpackages) : [],
      islands: r.islands ? JSON.parse(r.islands) : [],
    }));
  },

  // Get earnings statistics for owner
  getOwnerEarningsStats: async (ownerId, startDate = null, endDate = null) => {
    let dateFilter = '';
    let params = [ownerId];
    
    if (startDate && endDate) {
      dateFilter = 'AND b.booking_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      dateFilter = 'AND b.booking_date >= ?';
      params.push(startDate);
    } else if (endDate) {
      dateFilter = 'AND b.booking_date <= ?';
      params.push(endDate);
    }

    const [rows] = await db.query(
      `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN b.total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN b.total_price ELSE 0 END) / 
        NULLIF(SUM(CASE WHEN b.payment_status = 'Paid' THEN 1 ELSE 0 END), 0) as avg_booking_value,
        MIN(CASE WHEN b.payment_status = 'Paid' THEN b.booking_date END) as first_booking_date,
        MAX(CASE WHEN b.payment_status = 'Paid' THEN b.booking_date END) as last_booking_date,
        
        -- Monthly breakdown
        SUM(CASE WHEN b.payment_status = 'Paid' AND YEAR(b.booking_date) = YEAR(CURDATE()) AND MONTH(b.booking_date) = MONTH(CURDATE()) THEN b.total_price ELSE 0 END) as current_month_revenue,
        SUM(CASE WHEN b.payment_status = 'Paid' AND YEAR(b.booking_date) = YEAR(CURDATE()) AND MONTH(b.booking_date) = MONTH(CURDATE()) THEN 1 ELSE 0 END) as current_month_bookings,
        
        -- Previous month for comparison
        SUM(CASE WHEN b.payment_status = 'Paid' AND YEAR(b.booking_date) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(b.booking_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) THEN b.total_price ELSE 0 END) as previous_month_revenue,
        SUM(CASE WHEN b.payment_status = 'Paid' AND YEAR(b.booking_date) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(b.booking_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) THEN 1 ELSE 0 END) as previous_month_bookings
        
      FROM bookings b
      JOIN boats bo ON b.boat_id = bo.boat_id
      WHERE bo.owner_id = ? AND b.is_deleted = 0 ${dateFilter}
    `,
      params
    );

    const stats = rows[0];
    
    // Calculate growth percentages
    const currentMonthRevenue = parseFloat(stats.current_month_revenue) || 0;
    const previousMonthRevenue = parseFloat(stats.previous_month_revenue) || 0;
    const currentMonthBookings = parseInt(stats.current_month_bookings) || 0;
    const previousMonthBookings = parseInt(stats.previous_month_bookings) || 0;
    
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
      : 0;
    
    const bookingGrowth = previousMonthBookings > 0 
      ? ((currentMonthBookings - previousMonthBookings) / previousMonthBookings * 100).toFixed(1)
      : 0;

    return {
      total_bookings: parseInt(stats.total_bookings) || 0,
      completed_bookings: parseInt(stats.completed_bookings) || 0,
      total_revenue: parseFloat(stats.total_revenue) || 0,
      avg_booking_value: parseFloat(stats.avg_booking_value) || 0,
      current_month_revenue: currentMonthRevenue,
      current_month_bookings: currentMonthBookings,
      previous_month_revenue: previousMonthRevenue,
      previous_month_bookings: previousMonthBookings,
      revenue_growth: parseFloat(revenueGrowth),
      booking_growth: parseFloat(bookingGrowth),
      first_booking_date: stats.first_booking_date,
      last_booking_date: stats.last_booking_date
    };
  },

  // Get monthly earnings breakdown
  getOwnerMonthlyEarnings: async (ownerId, year = null) => {
    const targetYear = year || new Date().getFullYear();
    
    const [rows] = await db.query(
      `
      SELECT 
        MONTH(b.booking_date) as month,
        MONTHNAME(b.booking_date) as month_name,
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN b.total_price ELSE 0 END) as revenue
      FROM bookings b
      JOIN boats bo ON b.boat_id = bo.boat_id
      WHERE bo.owner_id = ? AND b.is_deleted = 0 AND YEAR(b.booking_date) = ?
      GROUP BY MONTH(b.booking_date), MONTHNAME(b.booking_date)
      ORDER BY MONTH(b.booking_date)
    `,
      [ownerId, targetYear]
    );

    return rows.map(row => ({
      month: parseInt(row.month),
      month_name: row.month_name,
      total_bookings: parseInt(row.total_bookings),
      completed_bookings: parseInt(row.completed_bookings),
      revenue: parseFloat(row.revenue) || 0
    }));
  },

  // Get dashboard overview data for owner
  getOwnerDashboardData: async (ownerId) => {
    // Get total boats count
    const [boatCount] = await db.query(
      `SELECT COUNT(*) as total_boats FROM boats WHERE owner_id = ?`,
      [ownerId]
    );

    // Get total bookings count
    const [bookingCount] = await db.query(
      `SELECT COUNT(*) as total_bookings FROM bookings b JOIN boats bo ON b.boat_id = bo.boat_id WHERE bo.owner_id = ?`,
      [ownerId]
    );

    // Get total earnings from paid bookings
    const [monthlyEarnings] = await db.query(
      `SELECT 
        SUM(CASE WHEN b.payment_status = 'Paid' THEN b.total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN b.payment_status = 'Paid' AND YEAR(b.booking_date) = YEAR(CURDATE()) AND MONTH(b.booking_date) = MONTH(CURDATE()) THEN b.total_price ELSE 0 END) as current_month_revenue,
        SUM(CASE WHEN b.payment_status = 'Paid' AND YEAR(b.booking_date) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(b.booking_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) THEN b.total_price ELSE 0 END) as previous_month_revenue
      FROM bookings b 
      JOIN boats bo ON b.boat_id = bo.boat_id 
      WHERE bo.owner_id = ?`,
      [ownerId]
    );

    // Get average rating (if reviews table exists)
    const [ratingData] = await db.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
       FROM reviews r 
       JOIN boats bo ON r.boat_id = bo.boat_id 
       WHERE bo.owner_id = ?`,
      [ownerId]
    );

    // Get recent bookings
    const [recentBookings] = await db.query(
      `
      SELECT 
        b.booking_id,
        b.booking_date,
        b.status,
        b.payment_method,
        b.total_price,
        u.full_name as customer_name,
        bo.name as boat_name,
        bo.boat_type,
        (
          SELECT bi.image_url 
          FROM boatimages bi 
          WHERE bi.boat_id = bo.boat_id 
          LIMIT 1
        ) as boat_image
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN boats bo ON b.boat_id = bo.boat_id
      WHERE bo.owner_id = ?
      ORDER BY b.created_at DESC
      LIMIT 5
      `,
      [ownerId]
    );

    // Calculate growth percentages
    const totalRevenue = parseFloat(monthlyEarnings[0].total_revenue) || 0;
    const currentMonthRevenue = parseFloat(monthlyEarnings[0].current_month_revenue) || 0;
    const previousMonthRevenue = parseFloat(monthlyEarnings[0].previous_month_revenue) || 0;
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
      : 0;

    const result = {
      totalBoats: parseInt(boatCount[0].total_boats) || 0,
      totalBookings: parseInt(bookingCount[0].total_bookings) || 0,
      avgRating: parseFloat(ratingData[0].avg_rating) || 0,
      totalReviews: parseInt(ratingData[0].total_reviews) || 0,
      monthlyEarnings: totalRevenue,
      revenueGrowth: parseFloat(revenueGrowth),
      recentBookings: recentBookings.map(booking => ({
        id: booking.booking_id,
        boat: booking.boat_name,
        customer: booking.customer_name,
        date: booking.booking_date,
        status: booking.status,
        payment: booking.payment_method,
        amount: booking.total_price,
        boatType: booking.boat_type,
        image: booking.boat_image
      }))
    };
    
    return result;
  },

  // Get owner performance metrics
  getOwnerPerformanceMetrics: async (ownerId, period = 'month') => {
    let dateFilter = '';
    let params = [ownerId];

    switch (period) {
      case 'week':
        dateFilter = 'AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)';
        break;
      case 'month':
        dateFilter = 'AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
        break;
      case 'year':
        dateFilter = 'AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
        break;
      default:
        dateFilter = 'AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
    }

    const [metrics] = await db.query(
      `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN b.payment_status = 'Paid' THEN b.total_price ELSE 0 END) as total_revenue,
        AVG(CASE WHEN b.payment_status = 'Paid' THEN b.total_price ELSE NULL END) as avg_booking_value,
        COUNT(DISTINCT b.user_id) as unique_customers,
        COUNT(DISTINCT b.boat_id) as active_boats
      FROM bookings b
      JOIN boats bo ON b.boat_id = bo.boat_id
      WHERE bo.owner_id = ? AND b.is_deleted = 0 ${dateFilter}
      `,
      params
    );

    return {
      totalBookings: parseInt(metrics.total_bookings) || 0,
      completedBookings: parseInt(metrics.completed_bookings) || 0,
      totalRevenue: parseFloat(metrics.total_revenue) || 0,
      avgBookingValue: parseFloat(metrics.avg_booking_value) || 0,
      uniqueCustomers: parseInt(metrics.unique_customers) || 0,
      activeBoats: parseInt(metrics.active_boats) || 0,
      completionRate: metrics.total_bookings > 0 ? (metrics.completed_bookings / metrics.total_bookings * 100).toFixed(1) : 0
    };
  },

  // Get owner activity summary
  getOwnerActivitySummary: async (ownerId) => {
    // Get today's bookings
    const [todayBookings] = await db.query(
      `SELECT COUNT(*) as count FROM bookings b 
       JOIN boats bo ON b.boat_id = bo.boat_id 
       WHERE bo.owner_id = ? AND DATE(b.booking_date) = CURDATE()`,
      [ownerId]
    );

    // Get this week's bookings
    const [weekBookings] = await db.query(
      `SELECT COUNT(*) as count FROM bookings b 
       JOIN boats bo ON b.boat_id = bo.boat_id 
       WHERE bo.owner_id = ? AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`,
      [ownerId]
    );

    // Get pending bookings
    const [pendingBookings] = await db.query(
      `SELECT COUNT(*) as count FROM bookings b 
       JOIN boats bo ON b.boat_id = bo.boat_id 
       WHERE bo.owner_id = ? AND b.status = 'Pending'`,
      [ownerId]
    );

    // Get upcoming bookings (next 7 days)
    const [upcomingBookings] = await db.query(
      `SELECT COUNT(*) as count FROM bookings b 
       JOIN boats bo ON b.boat_id = bo.boat_id 
       WHERE bo.owner_id = ? AND b.booking_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
      [ownerId]
    );

    return {
      todayBookings: parseInt(todayBookings.count) || 0,
      weekBookings: parseInt(weekBookings.count) || 0,
      pendingBookings: parseInt(pendingBookings.count) || 0,
      upcomingBookings: parseInt(upcomingBookings.count) || 0
    };
  },

  // Soft delete a booking
  softDelete: async (bookingId, deletedBy, reason = null) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Get booking details before deletion for history
      const bookingDetails = await Booking.getDetails(bookingId);
      if (!bookingDetails) {
        throw new Error('Booking not found');
      }

      // Soft delete the booking
      const [result] = await conn.query(
        `UPDATE bookings 
         SET is_deleted = 1, deleted_at = NOW(), deleted_by = ?, deletion_reason = ?
         WHERE booking_id = ? AND is_deleted = 0`,
        [deletedBy, reason, bookingId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Booking not found or already deleted');
      }

      // Add to booking history
      await conn.query(
        `INSERT INTO booking_history 
         (booking_id, action, old_values, new_values, changed_by, change_reason, created_at)
         VALUES (?, 'deleted', ?, ?, ?, ?, NOW())`,
        [
          bookingId,
          JSON.stringify(bookingDetails),
          JSON.stringify({ is_deleted: 1, deleted_at: new Date(), deleted_by: deletedBy, deletion_reason: reason }),
          deletedBy,
          reason || 'Booking deleted by user'
        ]
      );

      await conn.commit();
      return { success: true, message: 'Booking deleted successfully' };
    } catch (error) {
      await conn.rollback();
      console.error('Error soft deleting booking:', error);
      throw error;
    } finally {
      conn.release();
    }
  },

  // Restore a soft deleted booking
  restore: async (bookingId, restoredBy, reason = null) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Get booking details before restoration for history
      const [bookingRows] = await conn.query(
        `SELECT * FROM bookings WHERE booking_id = ? AND is_deleted = 1`,
        [bookingId]
      );

      if (bookingRows.length === 0) {
        throw new Error('Deleted booking not found');
      }

      const bookingDetails = bookingRows[0];

      // Restore the booking
      const [result] = await conn.query(
        `UPDATE bookings 
         SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL, deletion_reason = NULL
         WHERE booking_id = ? AND is_deleted = 1`,
        [bookingId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Booking not found or not deleted');
      }

      // Add to booking history
      await conn.query(
        `INSERT INTO booking_history 
         (booking_id, action, old_values, new_values, changed_by, change_reason, created_at)
         VALUES (?, 'restored', ?, ?, ?, ?, NOW())`,
        [
          bookingId,
          JSON.stringify(bookingDetails),
          JSON.stringify({ is_deleted: 0, deleted_at: null, deleted_by: null, deletion_reason: null }),
          restoredBy,
          reason || 'Booking restored by user'
        ]
      );

      await conn.commit();
      return { success: true, message: 'Booking restored successfully' };
    } catch (error) {
      await conn.rollback();
      console.error('Error restoring booking:', error);
      throw error;
    } finally {
      conn.release();
    }
  },

  // Get booking history
  getHistory: async (bookingId) => {
    try {
      const query = `
        SELECT 
          bh.*,
          u.full_name as changed_by_name,
          u.email as changed_by_email
        FROM booking_history bh
        LEFT JOIN users u ON bh.changed_by = u.user_id
        WHERE bh.booking_id = ?
        ORDER BY bh.created_at DESC
      `;
      
      const [rows] = await db.execute(query, [bookingId]);
      return rows;
    } catch (error) {
      console.error('Error getting booking history:', error);
      throw error;
    }
  },

  // Get deleted bookings for a user
  getDeletedBookings: async (userId) => {
    try {
      const query = `
        SELECT 
          b.*,
          u.full_name,
          u.email,
          bo.name AS boat_name,
          bo.boat_type,
          bo.rental_price,
          bo.capacity,
          bo.features,
          deleted_user.full_name AS deleted_by_name,
          -- Boat Images
          (
            SELECT CONCAT('[', GROUP_CONCAT(JSON_QUOTE(bi.image_url)), ']')
            FROM boatimages bi
            WHERE bi.boat_id = bo.boat_id
          ) AS boat_images
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        JOIN boats bo ON b.boat_id = bo.boat_id
        LEFT JOIN users deleted_user ON b.deleted_by = deleted_user.user_id
        WHERE b.user_id = ? AND b.is_deleted = 1
        ORDER BY b.deleted_at DESC
      `;
      
      const [rows] = await db.execute(query, [userId]);
      
      // Parse JSON strings into real objects/arrays
      return rows.map((r) => ({
        ...r,
        boat_images: r.boat_images ? JSON.parse(r.boat_images) : [],
      }));
    } catch (error) {
      console.error('Error getting deleted bookings:', error);
      throw error;
    }
  },

  // Add entry to booking history
  addToHistory: async (bookingId, action, oldValues, newValues, changedBy, changeReason) => {
    try {
      const query = `
        INSERT INTO booking_history 
        (booking_id, action, old_values, new_values, changed_by, change_reason, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;
      
      await db.execute(query, [
        bookingId,
        action,
        JSON.stringify(oldValues),
        JSON.stringify(newValues),
        changedBy,
        changeReason
      ]);
      
      return true;
    } catch (error) {
      console.error('Error adding to booking history:', error);
      throw error;
    }
  },

  // Update boat status
  updateBoatStatus: async (boatId, status) => {
    try {
      const query = `UPDATE boats SET status = ? WHERE boat_id = ?`;
      const [result] = await db.execute(query, [status, boatId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating boat status:', error);
      throw error;
    }
  },
};

module.exports = Booking;
