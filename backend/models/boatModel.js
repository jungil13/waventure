const db = require('../config/db');

const Boat = {
getAll: async () => {
  const [rows] = await db.query(`
    SELECT b.*,
           u.full_name,
           GROUP_CONCAT(bi.image_url) AS images
    FROM boats b
    LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
    LEFT JOIN users u ON b.owner_id = u.user_id
    GROUP BY b.boat_id
  `);

  return rows.map(row => ({
    ...row,
    images: row.images ? row.images.split(",") : []
  }));
},

getById: async (id) => {
  const [rows] = await db.query(`
    SELECT b.*,
           u.full_name,
           GROUP_CONCAT(bi.image_url) AS images
    FROM boats b
    LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
    LEFT JOIN users u ON b.owner_id = u.user_id
    WHERE b.boat_id = ?
    GROUP BY b.boat_id
  `, [id]);

  if (!rows[0]) return null;

  return {
    ...rows[0],
    images: rows[0].images ? rows[0].images.split(",") : []
  };
},

getAvailable: async (date, time, duration) => {
  // Get boats that are available and not booked for the specified date/time
  const [rows] = await db.query(`
    SELECT DISTINCT b.*,
           u.full_name,
           GROUP_CONCAT(bi.image_url) AS images
    FROM boats b
    LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
    LEFT JOIN users u ON b.owner_id = u.user_id
    LEFT JOIN bookings bk ON b.boat_id = bk.boat_id 
      AND bk.booking_date = ? 
      AND bk.booking_time = ?
      AND bk.status IN ('Pending', 'Confirmed')
    WHERE b.status = 'Available' 
      AND bk.booking_id IS NULL
    GROUP BY b.boat_id
    ORDER BY b.rental_price ASC
  `, [date, time]);

  return rows.map(row => ({
    ...row,
    images: row.images ? row.images.split(",") : []
  }));
},

getByOwnerId: async (owner_id) => {
  const [rows] = await db.query(`
    SELECT b.*,
           u.full_name,
           GROUP_CONCAT(bi.image_url) AS images
    FROM boats b
    LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
    LEFT JOIN users u ON b.owner_id = u.user_id
    WHERE b.owner_id = ?
    GROUP BY b.boat_id
  `, [owner_id]);

  return rows.map(row => ({
    ...row,
    images: row.images ? row.images.split(",") : []
  }));
},

  create: async (boat, images = []) => {
    const { owner_id, name, features, capacity, boat_type, rental_price, duration_options, status } = boat;

    const [result] = await db.query(
      `INSERT INTO boats (owner_id, name, features, capacity, boat_type, rental_price, duration_options, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [owner_id, name, features, capacity, boat_type, rental_price, duration_options, status]
    );

    const boatId = result.insertId;

    if (images.length > 0) {
      const values = images.map(url => [boatId, url]);
      await db.query(`INSERT INTO boatimages (boat_id, image_url) VALUES ?`, [values]);
    }

    return { boat_id: boatId, ...boat, images };
  },

  update: async (id, boat, images = []) => {
    const fieldsToUpdate = [];
    const values = [];

    for (const key in boat) {
      if (boat[key] !== undefined) { 
        fieldsToUpdate.push(`${key}=?`);
        values.push(boat[key]);
      }
    }

    if (fieldsToUpdate.length > 0) {
      await db.query(
        `UPDATE boats 
         SET ${fieldsToUpdate.join(', ')} 
         WHERE boat_id=?`,
        [...values, id]
      );
    }

    // If new images provided → append them
    if (images.length > 0) {
      const imageValues = images.map(url => [id, url]);
      await db.query(`INSERT INTO boatimages (boat_id, image_url) VALUES ?`, [imageValues]);
    }

    // Fetch the updated boat to return the latest state
    return await Boat.getById(id);
  },

  addImages: async (id, images) => {
    if (images.length > 0) {
      const values = images.map(url => [id, url]);
      await db.query(`INSERT INTO boatimages (boat_id, image_url) VALUES ?`, [values]);
    }
    return { boat_id: id, added: images };
  },

  delete: async (id) => {
    await db.query('DELETE FROM boatimages WHERE boat_id=?', [id]); // remove images first
    await db.query('DELETE FROM boats WHERE boat_id=?', [id]);
    return { message: 'Boat and images deleted successfully' };
  },

  getAllBoats: async () => {
    const [rows] = await db.query(`
      SELECT b.*,
             u.full_name as owner_name,
             u.email as owner_email,
             GROUP_CONCAT(bi.image_url) AS images
      FROM boats b
      LEFT JOIN boatimages bi ON b.boat_id = bi.boat_id
      LEFT JOIN users u ON b.owner_id = u.user_id
      GROUP BY b.boat_id
      ORDER BY b.boat_id DESC
    `);

    return rows.map(row => ({
      ...row,
      images: row.images ? row.images.split(",") : []
    }));
  }
};

module.exports = Boat;
