const express = require('express');
const router = express.Router();
const hostController = require('../controllers/hostController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(verifyToken);
router.use(requireRole('host'));

router.put('/profile', upload.single('profilePic'), hostController.updateProfile);
router.post('/events', upload.single('eventImage'), hostController.createEvent);
router.put('/events/:id', hostController.updateEvent);
router.get('/events', hostController.getEvents);
router.post('/verify', upload.single('passportFile'), hostController.submitVerification);
router.get('/bookings', hostController.getBookings);
router.post('/events/:id/discount', hostController.applyDiscount);
module.exports = router;
