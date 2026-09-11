const express = require('express');
const router = express.Router();
const travelerController = require('../controllers/travelerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(verifyToken);
router.use(requireRole('traveler'));

router.put('/profile', upload.single('profilePic'), travelerController.updateProfile);
router.post('/bookings', travelerController.bookEvent);
router.get('/bookings', travelerController.getBookings);
router.post('/bookings/:id/download', travelerController.downloadTicket);

module.exports = router;
