const FoodPackage = require("../models/foodPackageModel");
const Addon = require("../models/addonModel");
const path = require("path");

const addFoodPackage = async (req, res) => {
  try {
    if (req.user.user_type !== "BoatOwner") return res.status(403).json({ message: "Only BoatOwners can add" });

    const { boat_id, name, description, price, status } = req.body;
    const images = req.files.map(file => `/uploads/boats/${path.basename(file.path)}`)
    

    await FoodPackage.add({ boat_id, name, description, price, status, images });
    res.json({ message: "Food package added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const editFoodPackage = async (req, res) => {
  try {
    const { package_id } = req.params;
    const { name, description, price, status, existing_images } = req.body;
    
    // Handle images: combine existing images with new ones
    let images = [];
    
    // Parse existing images if provided
    if (existing_images) {
      try {
        images = JSON.parse(existing_images);
      } catch (e) {
        console.error('Error parsing existing images:', e);
      }
    }
    
    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/boats/${f.filename}`);
      images = [...images, ...newImages];
    }
    
    await FoodPackage.edit({ package_id, name, description, price, status, images });
    res.json({ message: "Food package updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getFoodPackages = async (req, res) => {
  try {
    const { boat_id } = req.params;
    const packages = await FoodPackage.getByBoat(boat_id);
    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getFoodPackagesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const packages = await FoodPackage.getByUser(user_id);
    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === Addon ===
const addAddon = async (req, res) => {
  try {
    if (req.user.user_type !== "BoatOwner") return res.status(403).json({ message: "Only BoatOwners can add" });

    const { boat_id, name, description, price, status } = req.body;
    const images = req.files?.map(f => `/uploads/boats/${f.filename}`) || [];

    await Addon.add({ boat_id, name, description, price, status, images });
    res.json({ message: "Addon added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const editAddon = async (req, res) => {
  try {
    const { addon_id } = req.params;
    const { name, description, price, status, existing_images } = req.body;
    
    // Handle images: combine existing images with new ones
    let images = [];
    
    // Parse existing images if provided
    if (existing_images) {
      try {
        images = JSON.parse(existing_images);
      } catch (e) {
        console.error('Error parsing existing images:', e);
      }
    }
    
    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/boats/${f.filename}`);
      images = [...images, ...newImages];
    }

    await Addon.edit({ addon_id, name, description, price, status, images });
    res.json({ message: "Addon updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAddons = async (req, res) => {
  try {
    const { boat_id } = req.params;
    const addons = await Addon.getByBoat(boat_id);
    res.json(addons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAddonsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const addons = await Addon.getByUser(user_id);
    res.json(addons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addFoodPackage,
  editFoodPackage,
  getFoodPackages,
  getFoodPackagesByUser,
  addAddon,
  editAddon,
  getAddons,
  getAddonsByUser
};
