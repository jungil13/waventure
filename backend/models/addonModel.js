const db = require("../config/db");

const Addon = {
  add: async ({ boat_id, name, description, price, status, images }) => {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.query(
        `INSERT INTO addons (boat_id, name, description, price, status, images) VALUES (?, ?, ?, ?, ?, ?)`,
        [boat_id, name, description, price, status, JSON.stringify(images)]
      );
      return result;
    } finally {
      conn.release();
    }
  },

  edit: async ({ addon_id, name, description, price, status, images }) => {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.query(
        `UPDATE addons SET name=?, description=?, price=?, status=?, images=? WHERE addon_id=?`,
        [name, description, price, status, JSON.stringify(images), addon_id]
      );
      return result;
    } finally {
      conn.release();
    }
  },

  getByBoat: async (boat_id) => {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(`SELECT * FROM addons WHERE boat_id=?`, [boat_id]);
      return rows.map(r => ({ ...r, images: JSON.parse(r.images || "[]") }));
    } finally {
      conn.release();
    }
  },

  getByUser: async (user_id) => {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT a.* FROM addons a
         JOIN boats b ON a.boat_id = b.boat_id
         WHERE b.owner_id=?`,
        [user_id]
      );
      return rows.map(r => ({ ...r, images: JSON.parse(r.images || "[]") }));
    } finally {
      conn.release();
    }
  },
};

module.exports = Addon;
