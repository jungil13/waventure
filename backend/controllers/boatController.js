const Boat = require('../models/boatModel');
const path = require('path');

const boatController = {
  getAllBoats: async (req, res) => {
    try {
      const boats = await Boat.getAll();
      const parsedBoats = boats.map(boat => ({
        ...boat,
        features: safeParseJSON(boat.features),
        duration_options: safeParseJSON(boat.duration_options),
      }));
      res.json(parsedBoats);
    } catch (err) {
      console.error("Error in getAllBoats:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getBoatById: async (req, res) => {
    try {
      const boat = await Boat.getById(req.params.id);
      if (!boat) return res.status(404).json({ message: 'Boat not found' });

      const parsedBoat = {
        ...boat,
        features: safeParseJSON(boat.features),
        duration_options: safeParseJSON(boat.duration_options),
      };
      res.json(parsedBoat);
    } catch (err) {
      console.error("Error in getBoatById:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getAvailableBoats: async (req, res) => {
    try {
      const { date, time, duration } = req.query;
      
      if (!date || !time) {
        return res.status(400).json({ message: 'Date and time are required' });
      }

      const boats = await Boat.getAvailable(date, time, duration);
      const parsedBoats = boats.map(boat => ({
        ...boat,
        features: safeParseJSON(boat.features),
        duration_options: safeParseJSON(boat.duration_options),
        images: boat.images || []
      }));
      
      res.json(parsedBoats);
    } catch (err) {
      console.error("Error in getAvailableBoats:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getMyBoats: async (req, res) => {
    try {
      if (req.user.user_type !== "BoatOwner") {
        return res.status(403).json({ message: "Only boat owners can view their boats" });
      }

      const boats = await Boat.getByOwnerId(req.user.user_id);
      const parsedBoats = boats.map(boat => ({
        ...boat,
        features: safeParseJSON(boat.features),
        duration_options: safeParseJSON(boat.duration_options),
      }));
      res.json(parsedBoats);
    } catch (err) {
      console.error("Error in getMyBoats:", err);
      res.status(500).json({ error: err.message });
    }
  },

createBoat: async (req, res) => {
  try {
    if (req.user.user_type !== "BoatOwner") {
      return res.status(403).json({ message: "Only boat owners can create boats" });
    }

    const owner_id = req.user?.user_id;
    if (!owner_id) {
      console.error("❌ Owner ID missing in token. req.user:", req.user);
      return res.status(400).json({ message: "Invalid token or owner ID missing" });
    }

    const images = req.files
      ? req.files.map(file => `/uploads/boats/${path.basename(file.path)}`)
      : [];

    const newBoatData = {
      owner_id,
      name: req.body.name,
      features: Array.isArray(req.body.features)
        ? JSON.stringify(req.body.features)
        : JSON.stringify((req.body.features || "").split(",").map(f => f.trim())),
      capacity: req.body.capacity,
      boat_type: req.body.boat_type,
      rental_price: req.body.rental_price,
      duration_options: Array.isArray(req.body.duration_options)
        ? JSON.stringify(req.body.duration_options)
        : JSON.stringify((req.body.duration_options || "").split(",").map(d => d.trim())),
      status: req.body.status || "Available",
    };

    const newBoat = await Boat.create(newBoatData, images);

    // Send notification for new boat added
    const sendNotification = req.app.get('sendNotification');
    if (sendNotification) {
      try {
        const notificationData = {
          owner_id: owner_id,
          user_id: null, // Send to all users
          boat_id: newBoat.boat_id,
          booking_id: null,
          type: 'new_boat',
          title: 'New Boat Available! 🚤',
          message: `A new boat "${newBoatData.name}" has been added. Check it out and book your next adventure!`
        };
        
        await sendNotification(notificationData);
      } catch (notificationError) {
        console.error('Error sending new boat notification:', notificationError);
        // Don't fail the boat creation if notification fails
      }
    }

    res.status(201).json({
      ...newBoat,
      features: safeParseJSON(newBoat.features),
      duration_options: safeParseJSON(newBoat.duration_options),
    });
  } catch (err) {
    console.error("Error in createBoat:", err);
    res.status(500).json({ error: err.message });
  }
},


  updateBoat: async (req, res) => {
    try {
      const owner_id = req.user.user_id;
      const images = req.files?.map(file => `/uploads/boats/${path.basename(file.path)}`) || [];

      const boat = await Boat.getById(req.params.id);
      if (!boat) return res.status(404).json({ message: 'Boat not found' });

      if (boat.owner_id !== owner_id && req.user.user_type !== "Admin") {
        return res.status(403).json({ message: 'Not allowed to update this boat' });
      }

      const updatedBoatData = {
        ...req.body,
        features: req.body.features ? JSON.stringify(req.body.features) : undefined,
        duration_options: req.body.duration_options ? JSON.stringify(req.body.duration_options) : undefined,
        owner_id
      };

      const updatedBoat = await Boat.update(req.params.id, updatedBoatData, images);

      res.json({
        ...updatedBoat,
        features: safeParseJSON(updatedBoat.features),
        duration_options: safeParseJSON(updatedBoat.duration_options),
      });
    } catch (err) {
      console.error("Error in updateBoat:", err);
      res.status(500).json({ error: err.message });
    }
  },

  addBoatImages: async (req, res) => {
    try {
      const owner_id = req.user.user_id;
      const boat = await Boat.getById(req.params.id);

      if (!boat) return res.status(404).json({ message: 'Boat not found' });
      if (boat.owner_id !== owner_id && req.user.user_type !== "Admin") {
        return res.status(403).json({ message: 'Not allowed to add images' });
      }

      const images = req.files.map(file => `/uploads/boats/${path.basename(file.path)}`);
      const result = await Boat.addImages(req.params.id, images);
      res.json(result);
    } catch (err) {
      console.error("Error in addBoatImages:", err);
      res.status(500).json({ error: err.message });
    }
  },

  deleteBoat: async (req, res) => {
    try {
      const owner_id = req.user.user_id;
      const boat = await Boat.getById(req.params.id);

      if (!boat) return res.status(404).json({ message: 'Boat not found' });
      if (boat.owner_id !== owner_id && req.user.user_type !== "Admin") {
        return res.status(403).json({ message: 'Not allowed to delete this boat' });
      }

      const result = await Boat.delete(req.params.id);
      res.json(result);
    } catch (err) {
      console.error("Error in deleteBoat:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

// ✅ helper: safe JSON.parse
function safeParseJSON(str) {
  try {
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
}

module.exports = boatController;
