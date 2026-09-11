const supabase = require('../config/supabase');

const updateProfile = async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        const profilePic = req.file ? req.file.path : null;

        const updateData = {};
        if (name) updateData.username = name;
        if (phoneNumber) updateData.phone_number = phoneNumber;
        if (profilePic) updateData.profile_pic = profilePic;

        const { data: updatedTraveler, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        delete updatedTraveler.password;
        res.status(200).json({ message: 'Traveler profile updated successfully', traveler: updatedTraveler });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const bookEvent = async (req, res) => {
    try {
        const { eventId, ticketsCount } = req.body;

        const { data: newBooking, error } = await supabase
            .from('bookings')
            .insert([{
                traveler_id: req.user.id,
                event_id: eventId,
                tickets_count: ticketsCount,
                status: 'confirmed'
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: 'Event booked successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error booking event', error: error.message });
    }
};

const getBookings = async (req, res) => {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, event:events(*)') // Assuming foreign key relation to fetch event details
            .eq('traveler_id', req.user.id);

        if (error) throw error;
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

module.exports = { updateProfile, bookEvent, getBookings };
