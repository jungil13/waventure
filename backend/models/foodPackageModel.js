const db = require("../config/db");

const FoodPackage = {
  add: async ({ boat_id, name, description, price, status, images }) => {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.query(
        `INSERT INTO foodpackages (boat_id, name, description, price, status, images) VALUES (?, ?, ?, ?, ?, ?)`,
        [boat_id, name, description, price, status, JSON.stringify(images)]
      );
      return result;
    } finally {
      conn.release();
    }
  },

  edit: async ({ package_id, name, description, price, status, images }) => {
    const conn = await db.getConnection();
    try {
      const [result] = await conn.query(
        `UPDATE foodpackages SET name=?, description=?, price=?, status=?, images=? WHERE package_id=?`,
        [name, description, price, status, JSON.stringify(images), package_id]
      );
      return result;
    } finally {
      conn.release();
    }
  },

  getByBoat: async (boat_id) => {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(`SELECT * FROM foodpackages WHERE boat_id=?`, [boat_id]);
      return rows.map(r => ({ ...r, images: JSON.parse(r.images || "[]") }));
    } finally {
      conn.release();
    }
  },

  getByUser: async (user_id) => {
    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT f.* FROM foodpackages f
         JOIN boats b ON f.boat_id = b.boat_id
         WHERE b.owner_id=?`,
        [user_id]
      );
      return rows.map(r => ({ ...r, images: JSON.parse(r.images || "[]") }));
    } finally {
      conn.release();
    }
  },
};

module.exports = FoodPackage;
