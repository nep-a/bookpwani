require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const hostRoutes = require('./routes/hostRoutes');
const travelerRoutes = require('./routes/travelerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve static uploads

app.use('/api/auth', authRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/traveler', travelerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
