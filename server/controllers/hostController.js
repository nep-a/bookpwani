const updateProfile = async (req, res) => {
    try {
        const { name, verificationDetails } = req.body;
        const profilePic = req.file ? req.file.path : null;

        // Mock DB update
        const updatedHost = {
            id: req.user.id,
            name: name || 'Updated Name',
            verificationDetails: verificationDetails || 'Pending Verification',
            profilePic: profilePic || 'default_pic.jpg'
        };

        res.status(200).json({ message: 'Host profile updated successfully', host: updatedHost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const { title, description, price, date } = req.body;
        const eventImage = req.file ? req.file.path : null;

        // Mock DB insert
        const newEvent = {
            id: 'event_' + Date.now(),
            hostId: req.user.id,
            title,
            description,
            price,
            date,
            image: eventImage
        };

        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, date } = req.body;

        // Mock DB update
        const updatedEvent = {
            id,
            hostId: req.user.id,
            title: title || 'Updated Title',
            description,
            price,
            date
        };

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        // Mock DB select
        const events = [
            { id: 'event_1', title: 'Mock Event 1', hostId: req.user.id },
            { id: 'event_2', title: 'Mock Event 2', hostId: req.user.id }
        ];

        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

module.exports = { updateProfile, createEvent, updateEvent, getEvents };
