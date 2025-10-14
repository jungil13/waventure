// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Route files based on field name: payment proofs go to uploads/payments, others to uploads/boats
    const subdir = file.fieldname === 'payment_proof' ? 'payments' : 'boats';
    const dir = path.join(__dirname, `../uploads/${subdir}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded image
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Export the multer instance directly, to be used with .array() or .single() in routes
const upload = multer({ storage });

module.exports = upload;
