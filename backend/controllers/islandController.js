const Island = require('../models/Island');

// Add Island (BoatOwner)
const addIsland = async (req, res) => {
  try {
    if (req.user.user_type !== 'BoatOwner') {
      return res.status(403).json({ message: "Only boat owners can suggest islands" });
    }

    const { name, description, price, features } = req.body;
    const created_by = req.user.user_id;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/boats/${file.filename}`);
    }

    const islandId = await Island.create({ name, description, created_by, images, price, features });
    res.status(201).json({ message: "Island suggested successfully", island_id: islandId, images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit Island
const editIsland = async (req, res) => {
  try {
    const { island_id } = req.params;
    const island = await Island.getById(island_id);
    if (!island) return res.status(404).json({ message: "Island not found" });

    if (req.user.user_type !== 'BoatOwner' || island.created_by !== req.user.user_id) {
      return res.status(403).json({ message: "Not authorized to edit this island" });
    }

    const { name, description, price, features } = req.body;

    let images = island.images;
    if (req.files && req.files.length > 0) {
      images = [...images, ...req.files.map(file => `/uploads/boats/${file.filename}`)];
    }

    await Island.update({ island_id, name, description, images, price, features });
    res.json({ message: "Island updated successfully", images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin Approve / Reject
const approveIsland = async (req, res) => {
  try {
    if (req.user.user_type !== 'Admin') return res.status(403).json({ message: "Only admin can approve islands" });
    const { island_id } = req.params;
    await Island.approve(island_id);
    res.json({ message: "Island approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const rejectIsland = async (req, res) => {
  try {
    if (req.user.user_type !== 'Admin') return res.status(403).json({ message: "Only admin can reject islands" });
    const { island_id } = req.params;
    await Island.reject(island_id);
    res.json({ message: "Island rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Islands
const getAllIslands = async (req, res) => {
  try {
    const islands = await Island.getAll();
    res.json(islands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Islands by User (BoatOwner)
const getIslandsByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const islands = await Island.getByUserId(user_id);
    res.json(islands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { addIsland, editIsland, approveIsland, rejectIsland, getAllIslands, getIslandsByUser };
