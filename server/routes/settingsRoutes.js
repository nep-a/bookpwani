const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken); // Applicable to all roles

router.get('/preferences', settingsController.getPreferences);
router.put('/preferences', settingsController.updatePreferences);

module.exports = router;
