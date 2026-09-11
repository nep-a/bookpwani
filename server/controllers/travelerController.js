const updateProfile = async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        const profilePic = req.file ? req.file.path : null;

        // Mock DB update
        const updatedTraveler = {
            id: req.user.id,
            name: name || 'Updated Name',
            phoneNumber: phoneNumber || '123-456-7890',
            profilePic: profilePic || 'default_pic.jpg'
        };

        res.status(200).json({ message: 'Traveler profile updated successfully', traveler: updatedTraveler });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const bookEvent = async (req, res) => {
    try {
        const { eventId, ticketsCount } = req.body;

        // Mock DB insert booking
        const newBooking = {
            id: 'booking_' + Date.now(),
            travelerId: req.user.id,
            eventId,
            ticketsCount,
            status: 'confirmed'
        };

        res.status(201).json({ message: 'Event booked successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error booking event', error: error.message });
    }
};

const getBookings = async (req, res) => {
    try {
        // Mock DB select
        const bookings = [
            { id: 'booking_1', eventId: 'event_1', status: 'confirmed' },
            { id: 'booking_2', eventId: 'event_2', status: 'pending' }
        ];

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

module.exports = { updateProfile, bookEvent, getBookings };
