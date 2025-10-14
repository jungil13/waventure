const db = require("../config/db");

const Island = {
  create: async ({
    name,
    description,
    created_by,
    images,
    price,
    features,
  }) => {
    const imagesJSON = JSON.stringify(images);
    const [result] = await db.execute(
      `INSERT INTO islands (name, description, created_by, images, price, features) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, created_by, imagesJSON, price, features]
    );
    return result.insertId;
  },

  update: async ({ island_id, name, description, images, price, features }) => {
    const imagesJSON = JSON.stringify(images);
    const [result] = await db.execute(
      `UPDATE islands SET name = ?, description = ?, images = ?, price = ?, features = ? WHERE island_id = ?`,
      [name, description, imagesJSON, price, features, island_id]
    );
    return result;
  },

  getAll: async () => {
    const [rows] = await db.execute(`
    SELECT i.*, u.full_name
    FROM islands i
    JOIN users u ON i.created_by = u.user_id
  `);

    return rows.map((row) => ({
      ...row,
      images: JSON.parse(row.images),
    }));
  },

  getByUserId: async (user_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM islands WHERE created_by = ?`,
      [user_id]
    );
    return rows.map((row) => ({ ...row, images: JSON.parse(row.images) }));
  },

  getPending: async () => {
    const [rows] = await db.execute(
      `SELECT * FROM islands WHERE status = 'Pending'`
    );
    return rows.map((row) => ({ ...row, images: JSON.parse(row.images) }));
  },

  approve: async (island_id) => {
    const [result] = await db.execute(
      `UPDATE islands SET status = 'Approved' WHERE island_id = ?`,
      [island_id]
    );
    return result;
  },

  reject: async (island_id) => {
    const [result] = await db.execute(
      `UPDATE islands SET status = 'Rejected' WHERE island_id = ?`,
      [island_id]
    );
    return result;
  },

  getById: async (island_id) => {
    const [rows] = await db.execute(
      `SELECT * FROM islands WHERE island_id = ?`,
      [island_id]
    );
    if (rows.length === 0) return null;
    return { ...rows[0], images: JSON.parse(rows[0].images) };
  },
};

module.exports = Island;
